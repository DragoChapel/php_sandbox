$(function(){
    $('[data-toggle="tooltip"]').tooltip();

    var editor = ace.edit("editor");
    var PhpMode = ace.require("ace/mode/php").Mode;
    var postCode = function(editor) {
        $.post('/execute', {'code': editor.getSession().getValue()}, function(response){
            var json = $.parseJSON(response);

            $('.output').html(json.result);
            $('#benchmark .memory').html(json.benchmark.memory);
            $('#benchmark .memory_peak').html(json.benchmark.memory_peak);
            $('#benchmark .time').html(json.benchmark.time);
        });
    };

    $('.reload').click(function(e){
        e.preventDefault();
        $.get('/get_last', function(response){
            editor.setValue(response);
        })
    });

    $('.evaluate').click(function(e){
        e.preventDefault();
        postCode(editor);
    });

    $('#formatted').click(function(){
        $('.output').toggleClass('format', $(this).is(':checked'));
    });

    editor.setTheme("ace/theme/ambiance");
    editor.session.setMode(new PhpMode());
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);


    // PhpStorm key bindings
    editor.commands.addCommand({
        name: "execute",
        bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
        exec: function(editor) { postCode(editor); }
    });
    editor.commands.addCommand({
        name: "movelinesup",
        bindKey: {win: "Alt-Shift-Up", mac: "Option-Shift-Up"},
        exec: function(editor) { editor.moveLinesUp(); },
        scrollIntoView: "cursor"
    });
    editor.commands.addCommand({
        name: "movelinesdown",
        bindKey: {win: "Alt-Shift-Down", mac: "Option-Shift-Down"},
        exec: function(editor) { editor.moveLinesDown(); },
        scrollIntoView: "cursor"
    });

    editor.commands.addCommand({
        name: "copylinedown",
        bindKey: {win: "Ctrl-D", mac: "Command-D"},
        exec: function(editor) { editor.copyLinesDown(); },
        scrollIntoView: "cursor"
    });

    // czesto klikam zapisz, chcac uzyskac execute - taki fix
    editor.commands.addCommand({
        name: "save",
        bindKey: {win: "Ctrl-S", mac: "Command-S"},
        exec: function(editor) { postCode(editor); },
        scrollIntoView: "cursor"
    });


});