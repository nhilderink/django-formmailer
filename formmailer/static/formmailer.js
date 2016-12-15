$.fn.mailable = function () {
    var data = {};
    var self = this;

    $(self).submit(function (event) {

        event.preventDefault();
        console.log($(self).find('input[type=submit]'));
        $(self).find('input[type=submit], button[type=submit]').prop('disabled', true);

        $(self).find(':checkbox:checked').each(function (key, field) {
            if (!data[field.name]) {
                data[field.name] = [];
            }
            data[field.name].push(field.value);
        });

        $(self).find(':radio:checked').each(function (key, field) {
            if (!data[field.name]) {
                data[field.name] = [];
            }
            data[field.name].push(field.value);
        });

        $(self).find('input, select, textarea')
            .not(':checkbox, :radio')
            .each(function (key, val) {
                data[val.name] = $(val).val();
            });
        console.log(data);

        $.ajax({
            type: "POST",
            url: "/mailer/",
            dataType: "json",
            async: true,
            data: data,
            success: function (data) {
                console.log('success');
                $(self).find('.form-spinner').fadeOut();
                $(self).find('.form-success').fadeIn();
            },
            error: function () {
                $(self).find('.form-spinner').fadeOut(function () {
                    $(self).find('.form-error').fadeIn();
                });

            },
            beforeSend: function () {
                $(self).find('.form-spinner').fadeIn();
                $(self).find('.form-success').fadeOut();
                $(self).find('.form-error').fadeOut();
            },
            complete: function () {
                data = {};
                $(self).find('input[type=submit], button[type=submit]').prop('disabled', false);
                console.log('complete');
                setTimeout(function () {
                    $(self).find('.form-success').fadeOut();
                    $(self).find('.form-error').fadeOut();
                }, 5000);
            }
        });
    });

}