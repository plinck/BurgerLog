"use strict";

$(document).ready(function () {

    // check for valid URL
    function isValidURL(str) {
        let pattern = new RegExp('^((ft|htt)ps?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?' + // port
            '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
            '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        return (pattern.test(str));
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        $(".form-inputs input").each(function () {
            if ($(this).val() === "") {
                isValid = false;
            }
        });

        return isValid;
    }

    // Extract form data
    function getFormData() {
        let formData = {
            name: $("#burgerName").val(),
        };
        return formData;
    }

    // Render the burger DIV
    function burgerRenderNotDevoured(burger) {
        let burgerDiv = "";

        burgerDiv += `
    <div id="${burger.id}" class="row mb-2 d-flex justify-content-between">
    <div class="col-6-sm mx-2">
        <button type="button" class="btn btn-primary burgersNotDevoured">${burger.name}</button>
    </div>
    <div class="col-6-sm mx-2">
        <button data-value=${burger.id} type="submit" class="devour btn btn-warning" title="Click to eat the ${burger.name} burger.">Devour>></button>
    </div>
    `;

        $('.isNotDevoured').append(burgerDiv);
    }

    // Render the burger DIV
    function burgerRenderDevoured(burger) {
        let burgerDiv = "";

        burgerDiv += `
        <div id="${burger.id}" class="row mb-2 d-flex justify-content-between">
        <div class="col-6-sm mx-2">
            <button type="button" class="btn btn-secondary burgersNotDevoured">${burger.name}</button>
        </div>
        <div class="col-2-sm mx-2">
        <button data-value=${burger.id} type="submit" class="delete btn btn-link" title="Click to delete the ${burger.name} burger.">
            <i data-value=${burger.id} class="fa fa-times" aria-hidden="true"></i>
        </button>
        </div>
        `;

        $('.isDevoured').append(burgerDiv);
    }

    // Capture the form inputs
    $("#addBurger").on("click", function (event) {
        event.preventDefault();

        // If all required fields are filled
        if (validateForm()) {

            // Create an object for the user"s data
            let burgerData = getFormData();

            // This is temporary until I get the data coming back working
            $("#burger-name").text(burgerData.name);

            // AJAX post the data to the 
            $.post("/burgers", burgerData, (data) => {
                console.log(data);
                // render to end of not devoured list
                burgerRenderNotDevoured(data);

                $("#burger-name").text(data.name);
                // Show the bootstrap modal dialog\
                $("#results-modal-dialog").modal("toggle");

                // This line was to force reload of the handlebars file but its a sucky hack and makes modal useless
                //window.location.reload();
            });
        } else {
            alert("Please fill out all fields");
        }
    });

    // Devour a burger
    // WOW.  What a find.  When I use the BINDING/Lambda/=> 
    // for callback, $(this) gets totally screwed up.  It7 must be how
    // object binds inside.  Holy shit.  That took me forever
    // so event => {},  makes JQuery $(this) get screwed up
    // Found good workaround use $(event.target) instead of this
    $(document).on("click", ".devour", event => {
        event.preventDefault();

        // Create an object for the user"s data
        let burgerData = {};
        burgerData.id = parseInt($(event.target).attr("data-value"));
        burgerData.isDevoured = true;

        // Remove from not devoured DOM
        $(`#${burgerData.id}`).remove();

        // AJAX PUT for update
        $.ajax({
            type: 'PUT',
            url: '/burgers',
            data: burgerData,
            success: (data) => {
                console.log(data);
                // render to end of devoured list
                burgerRenderDevoured(data);

                $("#burger-name").text(data.name);
                // Show the bootstrap modal dialog
                $("#results-modal-dialog").modal("toggle");

                // This line was to force reload of the handlebars file but its a sucky hack and makes modal useless
                // location.reload();
            }
        });
    });

    // DELETE
    $(document).on("click", ".delete", event => {
        event.preventDefault();

        // Create an object for the user"s data
        let burgerData = {};
        burgerData.id = parseInt($(event.target).attr("data-value"));

        // Remove from not devoured DOM
        $(`#${burgerData.id}`).remove();

        // AJAX PUT for update
        $.ajax({
            type: 'DELETE',
            url: `/burgers/${burgerData.id}`,
            data: burgerData,
            success: () => {
                console.log("Deleted");
                // This line was to force reload of the handlebars file but its a sucky hack and makes modal useless
                // location.reload();
            }
        });
    });

});