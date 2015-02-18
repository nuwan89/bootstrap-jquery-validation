# bootstrap-jquery-validation
A javascript lib to provide bootstrap form validation by the help of jQuery

Usage:

<form class="form-horizontal" data-validate>
    <div class="form-group">
        <label for="areaCode" class="col-sm-3">Area code :</label>
        <span class="col-sm-9">
            <input name="areaCode" type="text" id="areaCode" class="form-control" data-validate="not empty,number(1-10)"/>
        </span>
    </div>
    <div class="form-group">
        <span class="col-sm-9">
            <input name="age" type="text" id="age" class="form-control" data-validate="not empty,number,minLength(3),maxLength(5)"/>
        </span>
    </div>
    <input type="submit" />
</form>
