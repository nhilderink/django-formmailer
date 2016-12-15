# Django formmailer
Django formmailer is a simple and straightforward library that lets you easily gather and mail form fields.  
It consists of a client-side *Javascript* file and a *Django* app.

## jQuery plugin file: *formmailer.js*
This file loops over all inputs a mailable form has and prepares the data to be sent in a ```HTML POST```.

## Django app: *formmailer*
The *formmailer* app exposes an endpoint which receives post data.  
Each input's data is then cast into the ```MailerForm``` object as a ```CharField``` for cleaning.   
*If the fields have any other value than a string (such as a file), the form will be invalid.*

## Installation
1. Copy the *formmailer* app to your project
2. Register *formmailer* in your ```INSTALLED_APPS``` list
3. Include the endpoint url:  
```url(r'^mailer/', include('formmailer.urls')),```
4. Include the script file like: ```{% static 'formmailer.js' %}```
5. Define a form in your HTML, including the CSRF token:  
```HTML
<form id="testform">
    {% csrf_token %}
    <input type="hidden" name="mail_subject" value="Test Message">
    <input type="text" name="pizza_name" placeholder="name">
    <hr>
    <input type="checkbox" name="toppings" value="Ham"> Ham
    <input type="checkbox" name="toppings" value="Cheese"> Cheese
    <input type="checkbox" name="toppings" value="Tomato"> Tomato
    <hr>
    <input type="radio" name="temperature" value="Warm"> Hot
    <input type="radio" name="temperature" value="Koud"> Cold
    <hr>
    <textarea name="message" placeholder="Message"></textarea>
    <hr>
    <input type="submit" value="Send">
</form>
```
6. Make the form mailable:  
```Javascript
  $(document).ready(function() {
    //select form by id and bind it
    $("#testform").mailable();
  });
```

###### Fields worth noting:
* ```<input type="hidden" name="mail_subject">```  
can be used to set the subject of the email message. If it's not there the subject will be "Message from the website".

* ```<input type="submit" value="Send">``` the event handler that processes the form is bound to the form's *submit* event. So you should use an ```input``` or ```button``` of type *submit*.

## Django usage

Import the ```MailerForm``` class and instantiate + bind it to the ```POST``` data.   
Then, if the form ```.is_valid()``` call the ```.mailme()``` method.

```Python
from django.views.generic import View
from django.http import JsonResponse
from django.template.response import TemplateResponse
from .forms import MailerForm

class MailerView(View):

    template = "formmailer/mailer.html"

    def get(self, request):
        return TemplateResponse(request, template=self.template, context=None)

    def post(self, request):
        # Instantiate form and bind it
        form = MailerForm(request.POST)

        # If it's a valid form, mail it.
        if form.is_valid():
            form.mailme()

        return JsonResponse({'status': '200'})
```

## Some options:

### In Django:  
The ```mailme()``` method on the ```MailerForm``` class can have the following options:   

```Python
def mailme(self, email_from=None, email_to=None, ignorecsrftoken=False)
```

* **email_from**:string From email address, default: ```settings.DEFAULT_FROM_EMAIL```
* **email_to**:string Reciever email address, default: ```settings.DEFAULT_FROM_EMAIL```  
* **ignorecsrftoken**:boolean Whether or not include the CSRF token value in the email text.  
Default is ```True```

### In the HTML
* Use an image *inside* the form and give it class ```.form-spinner``` and set ```style='display: none;'``` to make it a loading icon while the form is being processed. It will automatically ```fadeIn()``` and ```fadeOut()```.
* Use a ```div``` with classes ```.form-success``` or ```.form-error```, to define either success or failure messages. Set ```style='display: none'``` to make them
automatically ```fadeIn()``` and ```fadeOut()```.
