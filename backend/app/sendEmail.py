import sendgrid
from sendgrid.helpers.mail import *
import configparser
from database import get_db_conn
from contextlib import closing


try:
    config = configparser.ConfigParser()
    config.read('../config.ini')
    api_key = config['mail']['key']
    can_email = True
except Exception as e:
    can_email = False
    print(f"Error: {e}")
    api_key = None


try:
    html_file = open("../emailTemplate/index.html", 'r')
    html = html_file.read()
    html_file.close()
except Exception as e:
    can_email = False
    print(f"Error: {e}")
    html = None


def sendEmail(videoID, captionAuthor, captionLanguage):
    if not can_email:
        print("Can't email, returning early")
        return

    print("\nFinding emails to send for new caption:",
          videoID, captionAuthor, captionLanguage)
    query = """
        SELECT email
        FROM ((SELECT followerGID AS googleID, followingGID AS following, NULL AS videoID FROM userFollows)
            UNION (SELECT userGID as googleID, NULL as following, videoID AS videoID FROM userSavedVideos))
            NATURAL JOIN users
        WHERE
            (following = %s
                AND (onlyNotifyOnLangMatchFollowing = FALSE OR language = %s)
                AND (getNotifsFollowing = 1 OR
                    (getNotifsFollowing = 2 AND %s IN (SELECT videoID FROM userSavedVideos WHERE userGID = googleID))
                )
            )
            OR
            (videoID = %s
                AND (onlyNotifyOnLangMatchVideos = FALSE OR language = %s)
                AND (getNotifsVideos = 1 OR
                    (getNotifsVideos = 2 AND %s IN (SELECT followingGID FROM userFollows WHERE followerGID = googleID))
                )
            );
    """
    with closing(get_db_conn()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(query, (captionAuthor, captionLanguage,
                           videoID, videoID, captionLanguage, captionAuthor))
            emails = cursor.fetchall()
            cursor.execute(
                "SELECT username FROM users WHERE googleID = %s", (captionAuthor,))
            authorUsername = cursor.fetchone()[0]
    print("Number of emails found:", len(emails))

    sg = sendgrid.SendGridAPIClient(api_key=api_key)
    from_email = Email("youcaption.noreply@gmail.com")
    subject = "New Captions!"
    formatted_html = html \
        .replace("{{authorUsername}}", authorUsername) \
        .replace("{{videoID}}", videoID) \
        .replace("{{language}}", captionLanguage)
    content = Content('text/html', formatted_html)

    for email in emails:
        to_email = To(email)
        mail = Mail(from_email, to_email, subject, content)
        response = sg.client.mail.send.post(request_body=mail.get())
        print("Email to", email, "status:", response.status_code)
    print("All emails sent")
