$(document).ready(function () {
    var socket = io();
    $('textarea').append("Socket connecting. \n");
    socket.on("status", function (data) {
        let host = data.host;
        let tr = $("tr[data-host='" + host + "']");
        let span = '';
        if (data.alive) {
            span = "<span class='text-success'>Alive</span>"
        } else {
            span = "<span class='text-danger'>Die</span>"
        }
        $("td:eq(2)", tr).html(span);


        let strtext = data.alive ? "alive" : "die";
        let text = data.host + ": " + strtext + " at " + data.time_change + " \n";
        $('textarea').append(text);
    });
    $(".add_host").click(function () {
        let host = $(".input_host").val();
        if (host == '') {
            return;
        }
        $.ajax({
            url: "/ajax/addhost",
            data: { host: host },
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                location.reload();
            }
        })
    });
    $(".remove_host").click(function () {
        let parent = $(this).parents("tr");
        let host = $(this).data("host");
        if (host == '') {
            return;
        }
        $.ajax({
            url: "/ajax/removehost",
            data: { host: host },
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                parent.remove();
            }
        })
    });
    $("th").click(function () {
        let index = $(this).index();
        let sort = $(this).data("sort");
        $('table tbody tr').sort(function (a, b) {
            let asort = $("td:eq(" + index + ")", $(a)).text();
            let bsort = $("td:eq(" + index + ")", $(b)).text();
            if (asort == bsort)
                return 0;
            if (sort == "up") {
                return asort > bsort ? 1 : -1;
            } else {
                return asort < bsort ? 1 : -1;
            }
        }).appendTo("table tbody");

        if (sort == "up") {
            $(this).data("sort", "down");
        } else {
            $(this).data("sort", "up");
        }
    })
})