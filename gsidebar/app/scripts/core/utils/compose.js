
export const getComposeId = target => $(target).find('input[name=composeid]').val();

export const getInputField = (target, type, isTextArea) =>{
    var $field,
        target = $(target);

    if (type === 'subject') {
        $field = target.find('input[name=subjectbox]');
        if ($field.length === 0) { // if old UI
            $field = target.find('input[name=subject]');
        }
    } else if (type === 'body') {
        $field = target.find('.Am.Al.editable.LW-avf');
        if ($field.length === 0) { // if old UI
            $field = $('iframe.Am.Al.editable').contents().find('.editable.LW-avf');
        }
    } else {
        if (isTextArea) {
            $field = target.find('textarea[name=' + type + ']');
        } else {
            $field = target.find('input[name=' + type + ']');
        }

    }
    return $field;
}
export const getFieldValue = (target, type) => {
    var val = [],
    $field = getInputField(target, type);
    _.each($field, function (el) {
        val.push($(el).val());
    });
    return val;
}
export const focusBody = target => {
    getInputField(target, 'body').focus();
}
export const getValues = target => ({
    to: getToVal(target),
    cc: getCCVal(target),
    bcc: getBCCVal(target),
    subject: getSubjectVal(target),
    body: getBodyVal(target),
    draftId: getDraftId(target)
});
export const setTo = (target, emails, forceClear) => {
    var $target = $(target);
    var $to = getInputField(target, 'to', true);

    $target.find('div.aoD.hl').focus();
    $target.find('.aoD.hl').click();
    $to.focus();
    if ($to.length > 0) {

        if (forceClear) {
            $to.val('');
            $target.find('.vM').click();
            $target.find('.oL.aDm.az9').html('');
        }

        $to.val(emails);
        focusBody(target);
    }
}
export const setBody = (target, content, forceClear) => {
    if (!content) {
        return;
    }
    var $body = getInputField(target, 'body');

    if (forceClear) {
        $body.html('');
    }

    $body.focus();
    var $content = $('<div>' + content + '</div>');
    if (forceAppend || !pasteHtmlAtCursor(content)) { //if fail to find insertion point
        $body.prepend($content);
    }

    WIZY.util.simulateButtonClick($(target).find("div[command='+removeFormat']")[0]);
    // setTimeout(function() {
    //     this.getInputField(target, 'body').focus();
    //     this.attachDriveLinkListeners(target);
    // }.bind(this), 200);
}
export const setCC = (target, emails) => {
    var $target = $(target);
    var $cc = getInputField(target, 'cc', true);
    $target.find('div.aoD.hl').focus();
    $target.find('.aoD.hl').click();
    $target.find('.aB.gQ.pE').click();
    $cc.focus();
    if ($cc.length > 0) {
        $cc.val(emails);
        focusBody(target);
    }
}
export const setBCC = (target, emails) => {
    var $target = $(target);
    var $bcc = getInputField(target, 'bcc', true);
    $target.find('.aB.gQ.pB').click();
    $target.find('.aoD.hl').click();
    $target.find('div.aoD.hl').focus();
    $bcc.focus();
    if ($bcc.length > 0) {
        $bcc.val(emails);
        focusBody(target);
    }
}
export const setSubject = (target, text, forceClear) => {
    var $subj = getInputField(target, 'subject', true),
        prevVal = $subj.val();
    if (text && text.length > 0) {

        if (forceClear) {
            $subj.val('');
            prevVal = '';
        }

        $subj.val(prevVal + text);
        // getInputField(target, 'body').focus();const
    }
}
export const setComposeValues = (target, {to, bcc, cc, body, subject}, bodyForceClear, bodyForceAppend) => {
    if (to) setTo(target, to);
    if (bcc) setBCC(target, bcc);
    if(cc) setCC(target, cc);
    setBody(target, body, bodyForceClear, bodyForceAppend);
    setSubject(target, subject);
}
export const getToVal = target => getFieldValue(target, 'to').join(';');
export const getCCVal = target => getFieldValue(target, 'cc').join(';');
export const getBCCVal = target => getFieldValue(target, 'bcc').join(';');
export const getSubjectVal = target => getInputField(target, 'subject').val();
export const getBodyVal = target => $(target).find('.Am.Al.editable.LW-avf').html();
export const getDraftId = target => getInputField(target, 'draft').val();
