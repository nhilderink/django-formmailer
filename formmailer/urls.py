from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.MailerView.as_view(), name='mailer')
]