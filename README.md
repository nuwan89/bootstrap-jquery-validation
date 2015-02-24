# bootstrap-jquery-validation
A javascript lib to provide bootstrap form validation by the help of jQuery

Usage:
```
<form class="form-horizontal" data-validate="true">
    <div class="form-group">
        <label for="areaCode" class="col-sm-3">Area code :</label>
        <span class="col-sm-9">
            <input name="areaCode" type="text" id="areaCode" class="form-control" data-validate="not empty,number(1-10)"/>
        </span>
    </div>
    <div class="form-group">
        <label for="someCode" class="col-sm-3">Some code :</label>
        <span class="col-sm-9">
            <input name="someCode" type="text" id="someCode" class="form-control" data-validate="not empty,number,minLength(3),maxLength(5)"/>
        </span>
    </div>
    <input type="submit" />
</form>

<style>
    $V.load({dyn:true, iconFeedback:true});
</style>
```
In the following form, the area code must not be empty and it should be a valid number between 1 and 10 (both inclusive).
The Some code field will only be validated unless its value is not empty and it has maximum length of 5 and minimum length of 3

$V.load function is used to initialize the validation framework. 

Options:

1. dyn:true --> will perform validation when user starts typing into fields.
2. iconFeedback:true --> will use FontsAwesome icon pack to display validation feedback messages.