from django.views.generic import View
from django.http import JsonResponse
from django.template.response import TemplateResponse
from .forms import MailerForm

class MailerView(View):

    template = "formmailer/mailer.html"

    def get(self, request):
        return TemplateResponse(request, template=self.template, context=None)

    def post(self, request):
        form = MailerForm(request.POST)

        if form.is_valid():
            form.mailme()

        return JsonResponse({'status': '200'})