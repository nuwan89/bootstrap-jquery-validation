//Defining global namespace JQBSTVALIDATOR if not exists
var JQBSTVALIDATOR = JQBSTVALIDATOR || {};
JQBSTVALIDATOR.lib = {};
//Creating an alias for quick access
var $V = JQBSTVALIDATOR.lib;
$V.settings = {
    dyn: false,
    animate: false,
    iconFeedback: false,
    tes: "TEST"
};
$V.load = function (custom) {
    $.extend(true, $V.settings, custom);
};
//Handles validation
$(function () {
    /**
     Following section will create OO classes
     */

    $V.Validator = function (rules) {
    };
    $V.Validator.prototype.name = "Default Name";
    $V.Validator.prototype.rules = [];
    $V.Validator.prototype.validate = function (fieldValue, label) {
        //Generate Rules Array
        this.rules = this.name.split(",");
        var errorMessage = "";
        for (i = 0; i < this.rules.length; i++) {
            if (this.rules[i] === "not empty" && fieldValue === "") {
                errorMessage = label + " can not be empty";
                //return errorMessage;
            } else if (this.rules[i] === "number") {
                errorMessage = this.numberValidate(fieldValue, label);
                //return errorMessage;
            } else if (this.rules[i].match(/number\(\d+-\d+\)/)) {
                errorMessage = this.numberRangeValidate(this.rules[i], fieldValue, label);
                //return errorMessage;
            } else if (this.rules[i] === "email") {
                errorMessage = this.emailValidate(fieldValue);
            } else if (this.rules[i].match(/length\(\d+\)/)) {
                errorMessage = this.lengthValidate(this.rules[i], fieldValue, label);
                //return errorMessage;
            } else if (this.rules[i].match(/minLength\(\d+\)/)) {
                errorMessage = this.minLengthValidate(this.rules[i], fieldValue, label);
                //return errorMessage;
            } else if (this.rules[i].match(/maxLength\(\d+\)/)) {
                errorMessage = this.maxLengthValidate(this.rules[i], fieldValue, label);
                //return errorMessage;
            } else if (this.rules[i].match(/custom\(\w+\)/)) {
                errorMessage = this.customValidate(this.rules[i], fieldValue);
                //return errorMessage;
            }
            if (errorMessage && errorMessage !== "") {
                return errorMessage;
            }
        }
    };
    /**
     Returns nothing (undefined) if text is empty string or number, 
     else an error string
     */
    $V.Validator.prototype.numberValidate = function (text, label) {
        text = (text === "") ? "1" : text;
        if (isNaN(parseInt(text))) {
            return "Enter a valid number for " + label;
        }
    };
    /**
     Returns nothing (undefined) if text is empty string.
     If text is an invalid number, error string will be returned.
     If number is within range, return nothing, else will return
     an error string.
     */
    $V.Validator.prototype.numberRangeValidate = function (range, text, label) {
        var res = range.replace(/^number\(/, "").match(/\d+-\d+/)[0];
        var min = res.split("-")[0];
        var max = res.split("-")[1];
        //Put a random number to text if it is left empty, so no error msg will be created
        //text = (text === "") ? "1" : text; 
        if (text !== "") {
            //If text is 123abc, NUMBER NOT IN RANGE error is displayed! Fix it!
            if (isNaN(parseInt(text))) {
                return "Enter a valid number for " + label;
            } else if (parseInt(text) < min || parseInt(text) > max) {
                return "Enter a valid number between " + min + " and " + max + " for the " + label;
            }
        }
    };
    /**
     Returns nothing (undefined) if text is empty string.
     If text is an invalid email, an error string will be returned.
     */
    $V.Validator.prototype.emailValidate = function (text) {
        if (text !== "" && !(/\w+@\w+\.\w+/).test(text)) {
            return "Enter a valid email address. Eg: yourname@google.com";
        }
    };
    /**
     Returns nothing (undefined) if text is empty string.
     If text length is not exactly equal to given value (eg: length(3))
     an error string will be returned.
     */
    $V.Validator.prototype.lengthValidate = function (rule, text, label) {
        var length = rule.replace(/length\(/, "").match(/\d+/)[0];
        if (text !== "" && text.length != length) {
            return "Value should be exactly " + length + " characters long for the " + label;
        }
    };
    /**
     Returns nothing (undefined) if text is empty string.
     If text length is less than the given min value (eg: minLength(3))
     an error string will be returned.
     */
    $V.Validator.prototype.minLengthValidate = function (rule, text, label) {
        var minLength = rule.replace(/minLength\(/, "").match(/\d+/)[0];
        if (text !== "" && text.length < minLength) {
            return "Value should be at least " + minLength + " characters long for the " + label;
        }
    };
    /**
     Returns nothing (undefined) if text is empty string.
     If text length is greater than the max char limit(eg: maxLength(3))
     an error string will be returned.
     */
    $V.Validator.prototype.maxLengthValidate = function (rule, text, label) {
        var maxLength = rule.replace(/maxLength\(/, "").match(/\d+/)[0];
        if (text !== "" && text.length > maxLength) {
            return "Value should not exceed " + maxLength + " characters for the " + label;
        }
    };
    /**
     Returns nothing (undefined) if text is empty string or returns user's 
     custom function's return message (if there were any)
     */
    $V.Validator.prototype.customValidate = function (rule, text) {
        var methodName = rule.replace(/custom\(/, "").replace(")", "").match(/\w+/)[0];
        if (text !== "") {
            return window[methodName](text);
        }
    };
    //Object.preventExtensions($V.Validator);

    $("#bt").click(function () {
        $(".error-field-text").css('visibility', 'visible')
        $(".error-field-text").fadeTo(250, 0);
    });

    $("#bt2").click(function () {
        $(".error-field-text").css('visibility', 'visible')
        $(".error-field-text").fadeTo(250, 1);
    });
    /**
     If the user set $V.load({dyn:true}), this will enable key up 
     listener validation.
     */
    function setupDynamic() {
        $(".form-horizontal .form-group").find("input[type=text].form-control, textarea.form-control")
                .each(function () {
                    if ($(this).data("validation-summernote")) {
                        var isValidate = $(this).data("validate");
                        if (isValidate) {
                            //Get all validation rules
                            var validationRules = isValidate;
                            //not supported in IE8 (and below)
                            var fieldElement = $(this);
                            $(this).siblings().find("div.note-editable").bind("DOMSubtreeModified", function () {
                                performValidation(fieldElement, validationRules, $(this));
                            });
                        }
                    } else {
                        $(this).keyup(function (event) {
                            var isValidate = $(this).data("validate");
                            if (isValidate) {
                                //Get all validation rules
                                var validationRules = isValidate;
                                performValidation($(this), validationRules, false);
                            }
                        });
                    }
                });
    }
    /**
     * Document this method!
     * 
     * @param {type} element
     * @param {type} validationRules
     * @param {type} summernote
     * @returns {Boolean}
     */
    function performValidation(element, validationRules, summernote) {
        var rule1 = new $V.Validator();
        rule1.name = validationRules;
        var fieldValue = null;
        if (summernote) {
            fieldValue = $(summernote).text();
        } else {
            fieldValue = $(element).val();
        }
        var labelText = $($("label[for='" + element[0].id + "']")).text();
        var validationMessage = rule1.validate(fieldValue, $.trim(labelText).replace(":", ""));
        if (validationMessage) {//Error exists
            showFieldErrors($(element), validationMessage);
            return false;
        } else {//Data submitted is valid
            clearFieldErrors($(element));
            return true;
        }
    }

    function init() {
        if ($V.settings.dyn) {
            setupDynamic();
        }
        //Get validation forms, setup onsubmit
        $("form").each(function () {
            if ($(this).data("validate")) {
                $(this).submit(function (event) {
                    return validate($(this));
                });
            }
        });
        /**
         The following code will inject error field elements. This will inject
         to other non validating groups as well!!
         */
        var appendedElement = $("<span class='error-field-text alert-danger'>ERROR TEXT</span>")
                .addClass("col-sm-12").css("visibility", "hidden").css("textAlign", "right");
        $(".form-horizontal .form-group").find("input[type=text].form-control, textarea.form-control")
                .parent().append(appendedElement);
        /**
         Add icon spans if user enables. Appended next to (after) error spans.
         This will also add has-feedback class to the form-groups
         */
        if ($V.settings.iconFeedback) {
            $(".form-horizontal .form-group").find(".error-field-text")
                    .after("<span aria-hidden='true'></span>").next()
                    .addClass("form-control-feedback").addClass("glyphicon").closest(".form-group")
                    .addClass("has-feedback");
            //.css("visibility","hidden");
        }
        function validate(form) {
            /**
             The following code will select all validation required elements
             */
            var isFormValid = true;
            $(form).find(".form-group input[type=text].form-control, textarea.form-control")
                    .each(function () {
                        var isValidate = $(this).data("validate");
                        if (isValidate) {
                            //Get all validation rules
                            var validationRules = isValidate;
                            if (!performValidation($(this), validationRules)) {
                                isFormValid = false;
                            }
                        }
                    });
            return isFormValid;
        }
    }

    function showFieldErrors(field, errorMessage) {
        $(field).closest(".form-group").addClass("has-error");
        $(field).closest(".form-group").removeClass("has-success");
        $(field).siblings(".form-control-feedback").addClass("glyphicon-remove");
        $(field).siblings(".form-control-feedback").removeClass("glyphicon-ok");
        //$(field).siblings(".error-field-text").fadeTo(2,0.1);
        $(field).siblings(".error-field-text").css("visibility", "visible").text(errorMessage);
        //$(field).siblings(".error-field-text").fadeTo(325,1);
    }

    function clearFieldErrors(field) {
        $(field).closest(".form-group").removeClass("has-error");
        $(field).closest(".form-group").addClass("has-success");
        $(field).siblings(".form-control-feedback").addClass("glyphicon-ok");
        $(field).siblings(".form-control-feedback").removeClass("glyphicon-remove");
        $(field).siblings(".error-field-text").css("visibility", "hidden");
        //$(field).siblings(".error-field-text").fadeTo(250,0);
    }

    init();
});