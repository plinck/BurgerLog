"use strict";

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

// Capture the form inputs
$("#addBurger").on("click", function (event) {
    event.preventDefault();

    // If all required fields are filled
    if (validateForm()) {

        // Create an object for the user"s data
        let burgerData = getFormData();
        
        // This is temporary until I get the data coming back working
        $("#burger-name").text(burgerData.name);

        // AJAX post the data to the friends API.
        $.post("/burgers", burgerData, (data) => {
            console.log(data);
            $("#burger-name").text(data.name);
            // Show the bootstrap modal dialog with the best match
            //window.location.reload();
            $("#results-modal-dialog").modal("toggle");

        });
    } else {
        alert("Please fill out all fields");
    }
});