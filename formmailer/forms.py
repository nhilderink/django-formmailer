from django import forms
from django.core.mail import send_mail
from django.conf import settings


class MailerForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(MailerForm, self).__init__(*args, **kwargs)
        for key in self.data:
            self.fields[key] = forms.CharField(required=False)

    def mailme(self, email_from=None, email_to=None, ignorecsrftoken=False):
        message = ""
        from_email = email_from or settings.DEFAULT_FROM_EMAIL
        to_email = [email_to] if email_to else [settings.DEFAULT_FROM_EMAIL]
        subject = self.cleaned_data.get('mail_subject', 'Message from the website')

        for key in self.fields:
            if key == "csrfmiddlewaretoken" and ignorecsrftoken:
                continue
            print(key)
            message += "\n{}: {}".format(key, self.cleaned_data[key])

        send_mail(subject=subject, message=message, from_email=from_email, recipient_list=to_email, fail_silently=False)
