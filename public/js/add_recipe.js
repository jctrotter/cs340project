import { strict } from "assert";
import { stringify } from "querystring";

function addStep(event) {

    console.log("CLICKED")
}

$(document).ready(() => {
    $('#step-add').click(addStep);
});
