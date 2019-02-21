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
        name: $("#burgerNane").val(),
        photo_url: $("#photo_url").val()
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

        // AJAX post the data to the friends API.
        $.post("/burgers", burgerData, (data) => {

            // Grab the result from the AJAX post so that the best match's name and photo are displayed.
            $("#burger-name").text(data.name);
            $("#burger-img").attr("src", data.photo_url);
            $("#burger-img").attr("alt", `${data.photo_url} Photo`);

            // Show the bootstrap modal dialog with the best match
            //$("#results-modal-dialog").modal("toggle");
        });
    } else {
        alert("Please fill out all fields");
    }
});