var b3api = process.env.API_BASE_URL;
var B3B2BToken = sessionStorage.getItem('B3B2BToken');
var po_number = sessionStorage.getItem('po_number');
var status = sessionStorage.getItem('B3CompanyStatus') === '1';
var quoteCheckoutId =  localStorage.getItem('quoteCheckoutId');
var url = b3api + '/api/v2/orders';
var updateQuoteUrl = b3api + '/api/v2/quotes/'+ quoteCheckoutId +'/ordered';
var errorMessage ='An error has occurred submitting your PO #/Reference #, please try it again or contact our customer support.';
var orderId = window.b3checkoutId;
var $overLay = $('#b2b_loading_overlay');

var hideOverlay = function() {
    $overLay.hide();
}
var errorCallback = function() {
    if (po_number) {
        Swal.fire({
            text: errorMessage,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'SUBMIT',
            closeOnClickOutside: false,
            allowOutsideClick: false,
            }).then(function(result) {
            if (result.value) {

            }
        })
    } else {
        hideOverlay();
    }
}

try{
    if (quoteCheckoutId) {
        $.ajax({
            type: 'put',
            url: updateQuoteUrl,
            contentType : 'application/json',
            headers: {
                authToken: B3B2BToken,
            },
            data: JSON.stringify({
                'orderId': orderId,
            }),
            beforeSend: function(XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('authToken', B3B2BToken);
            },
            success: function(resp) {
                localStorage.removeItem("quoteCheckoutId");
            },
            error: function(err) {},
        })
    }
    if (status) {
        var data = {
                orderId: window.b3checkoutId,
                poNumber: po_number,
            };
        $.ajax({
            type: 'post',
            url,
            contentType : 'application/json',
            headers: {
                authToken: B3B2BToken,
            },
            data: JSON.stringify(data),
            beforeSend: function(XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader('authToken', B3B2BToken);
            },
            success: function(resp) {
                sessionStorage.removeItem("po_number");
                hideOverlay();
            },
            error: function(err) {
                errorCallback();
            },
        })
    } else {
        hideOverlay();
    }
} catch {
    errorCallback();
}