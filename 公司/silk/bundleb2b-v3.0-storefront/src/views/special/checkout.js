var api = process.env.API_BASE_URL;
var B3CompanyId = sessionStorage.getItem('B3CompanyId');
var cartLimitUrl = "".concat(api, "/api/v2/qty/cartLimit");
var payMethodUrl = "".concat(api, "/api/v2/companies/").concat(B3CompanyId, "/payments");
var B3B2BToken = sessionStorage.getItem('B3B2BToken');
var B3CompanyStatus = sessionStorage.getItem('B3CompanyStatus');
var B3RoleId = sessionStorage.getItem('B3RoleId');
var b2bUser = B3CompanyStatus === '1';
var errorMessage = {
  notSalesRep: 'Please select a Company.',
  networkError: 'Could not complete the order, please try it again.',
  qtyErr: 'Some products do not pass the quantity verification.'
};
var $PONumberErrorElement = $("#custom_po_number_err");
var $checkoutPayContinueElement = $("#checkout-payment-continue-custom");
var $checkoutPayEmail = $("#checkout-payment-continue-email");
var $checkoutPayContinue = $("#checkout-payment-continue");
var $POElement = $("#custom_po_number");
var $radioCheque = $("#radio-cheque");
var hasRadioCheque = $radioCheque.length > 0;
var $formCheckoutItem = $('.form-checklist-item');
var payStatus = true;
var canPurchase = true;
var checkedPO = $radioCheque.prop("checked") == true;
var hasPOValue = $POElement.length > 0 && $POElement.val().trim() != "";
var selerepNoCompany = !Boolean(sessionStorage.getItem('B3CompanyId') && sessionStorage.getItem('B3CompanyStatus') === '1' || sessionStorage.getItem('B3RoleId') === '3');
var hasCompany = sessionStorage.getItem("B3CompanyStatus") && sessionStorage.getItem("B3CompanyStatus") === "1";

var errorCallback = function errorCallback(text, B3RoleId) {
  if (!b2bUser) {
    return;
  }

  ;
  Swal.fire({
    text: text,
    icon: 'error'
  }).then(function () {
    B3RoleId === '3' ? window.location.href = '/dashboard/' : location.reload();
  });
};

var POHtml = "<div class=\"form-checklist-container\">\n                    <div class=\"form-ccFields\">\n                        <div class=\"form-field--ccNumber form-field\">\n                        <label class=\"form-label optimizedCheckout-form-label\" for=\"ccNumber\">PO #</label>\n                        <input type=\"text\" id=\"custom_po_number\" class=\"form-input optimizedCheckout-form-input\" required/>\n                        </div>\n                    </div>\n                </div>";
var $placeOrderBtn = $("<button class=\"button \n                    button--action button--large button--slab optimizedCheckout-buttonPrimary\" \n                    id=\"checkout-payment-continue-custom\" type=\"button\">\n                    Place Order\n                </button>");
$("body").on('change', '[name="paymentProviderRadio"]', function () {
  // PO
  $PONumberErrorElement.remove();
  $checkoutPayContinueElement.hide();
  $checkoutPayEmail.hide();
  var checkedPO = $(this).attr("id") == "radio-cheque" && $(this).prop('checked') == true;

  if (checkedPO) {
    var $itemBody = $(this).parents(".form-checklist-item").find(".form-checklist-body");
    $itemBody.html(POHtml);
    $checkoutPayContinue.hide();
    $placeOrderBtn.insertAfter($checkoutPayContinue);
  } else {
    if ($checkoutPayContinueElement.length > 0) {
      $checkoutPayContinueElement.remove();
    }

    $checkoutPayContinue.show();
  }
});
$("body").on('focus', '#custom_po_number', function (event) {
  $PONumberErrorElement.remove();
});
/*save po number to our databse and order*/

$("body").on('click', '#checkout-payment-continue-custom', function (event) {
  if (checkedPO) {
    if (hasPOValue) {
      var poMessage = $POElement.val() || "";
      sessionStorage.setItem("po_number", poMessage);
    } else {
      canPurchase = false;
    }
  }

  if (canPurchase) {
    $checkoutPayContinue.click();
  } else {
    $PONumberErrorElement.remove();
    $('<span id="custom_po_number_err" style="display:block;color:red;font-size:14px;margin-top:5px;">PO # is required</span>').insertAfter($POElement);
  }
});
/*advqty start*/

function getCartAdvQtyCheckState(cartId) {
  return new Promise(function (resolve, rej) {
    $.ajax({
      type: 'get',
      url: "".concat(cartLimitUrl, "/").concat(cartId),
      headers: {
        authToken: B3B2BToken
      },
      beforeSend: function beforeSend(XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader('authToken', B3B2BToken);
      },
      success: function success(resp) {
        if (resp.code !== 200) {
          resolve(false);
        } else {
          resolve(resp.data.isAllowed);
        }
      },
      error: function error() {
        errorCallback(errorMessage.networkError);
      }
    });
  });
}

function getPayMethods() {
  return new Promise(function (resolve, rej) {
    $.ajax({
      type: 'get',
      url: "".concat(payMethodUrl),
      headers: {
        authToken: B3B2BToken
      },
      beforeSend: function beforeSend(XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader('authToken', B3B2BToken);
      },
      success: function success(resp) {
        resolve(resp);
      },
      error: function error() {
        errorCallback(errorMessage.networkError);
      }
    });
  });
}

// async function checkIsAllow() {
//   var cartId = window.b3cartId;
//   var passedCheck;

//   if (sessionStorage.getItem('B3CompanyStatus') === '1') {
//     var status = await getCartAdvQtyCheckState(cartId);

//     if (status !== '1') {
//       passedCheck = false;
//     } else {
//       passedCheck = true;
//     }

//     if (!passedCheck) {
//       if (!localStorage.getItem('quoteCheckoutId')) {
//         window.location.href = "/cart.php";
//       } else {
//         Swal.fire({
//           text: errorMessage.qtyErr,
//           icon: 'error'
//         });
//         window.location.href = "/";
//       }
//     }
//   }
// }

function HandleRadioCheque() {
  var checkedRadioCheque = $radioCheque.is(":checked");
  var noPONumber = $POElement.length === 0;

  if (checkedRadioCheque) {
    $("[name='paymentProviderRadio']:checked").trigger('change');
    var $checkItemBody = $radioCheque.parents(".form-checklist-item").find(".form-checklist-body");

    if (noPONumber) {
      $checkItemBody.html(POHtml);
    }
  }
}

var initPo = function initPo() {
  //  init PO
  if (hasCompany) {
    var timer = setInterval(function () {
      var $radioCheque = $("#radio-cheque");
      var hasRadioCheque = $radioCheque.length > 0;

      if (hasRadioCheque) {
        clearInterval(timer);
        HandleRadioCheque();
      }
    }, 500);
    getPayMethods().then(function (res) {
      var company_payments = res.data;
      var interval = setInterval(function () {
        var $checkoutItems = $(".checkout-step--payment .checkout-form .form-checklist .form-checklist-item");
        var hasCheckListItem = $checkoutItems.length > 0;

        if (hasCheckListItem) {
          clearInterval(interval);
          $checkoutItems.each(function () {
            var $paymentEle = $(this).find('[name="paymentProviderRadio"]');
            var paymentCode = $paymentEle.attr("id").replace("radio-", "");
            var isEnabled = false;

            for (var i = 0; i < company_payments.length; i++) {
              var showPayment = company_payments[i].code == paymentCode && company_payments[i].isEnabled == '1';

              if (showPayment) {
                isEnabled = true;
              }
            }

            if (!isEnabled) {
              $(this).remove();
            }
          });
        }
      }, 100);
      payStatus = true;
    });
  } else {
    var _timer = setInterval(function () {
      var $radioCheque = $("#radio-cheque");
      var hasRadioCheque = $radioCheque.length > 0;

      if (hasRadioCheque) {
        clearInterval(_timer);
        $radioCheque.parents('li.form-checklist-item').hide();
        payStatus = true;
        ;
      }
    }, 500);
  }
};

function paymentsInit() {
  var timerInterval = setInterval(function () {
    var $formCheckoutItem = $('.form-checklist-item');

    if ($formCheckoutItem.length > 0) {
      clearInterval(timerInterval);

      if (!payStatus) {
        return;
      }

      var payLength = $('.form-checklist li').length;

      if (payLength > 0) {
        payStatus = false;
        initPo();
      }
    }
  }, 100);
}

var itemsArray = ['#checkout-shipping-continue', '#checkout-billing-continue', '#checkout-billing-continue', "input[value='Continue to Payment']"];

function initOneCheckContinueBtn() {
  itemsArray.forEach(function (item) {
    $('body').on('click', item, function () {
      paymentsInit();
    });
  });
}

if (B3RoleId === '3' && !B3CompanyId) {
    Swal.fire({
      text: errorMessage.notSalesRep,
      icon: 'error'
    }).then(function () {
      window.location.href = '/dashboard/'
    });
}

var interval2 = setInterval(function () {
  var $hasItems = $(".checkout-step--payment .checkout-form .form-checklist .form-checklist-item").length > 0;

  if ($hasItems) {
    clearInterval(interval2);

    if (selerepNoCompany) {
      $radioCheque.parents('.form-checklist-item').remove();
    }
  }
}, 100);
// checkIsAllow();
paymentsInit();
initOneCheckContinueBtn();