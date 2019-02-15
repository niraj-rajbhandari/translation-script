import { merge } from '../merge';

const expect = require('chai').expect;

describe('Merge translation requests',() => {
  let base = {}, fix = {}, feature = {}, expected = {};
  before(() => {
    fix = {
      "STATEMENT": {
        "ONLINE_STATEMENT": {
          "HEADER": {
            "N_DOCUMENTS": "N Documents",
          }
        },
        "SELECT_INVOICE": "Select an invoice to continue making payment.", //changed ? => .
      }
    };

    feature = {
      "MAIN": {
        "LOADER_TEXT_TEXT": "Loading invoice...",
        "LOADER_TEXT_PAYPAL": "Contacting PayPal...",
        "PAYMENT_SUCCESS_EMAIL_CONFIRMATION": "A confirmation email has been sent to the business owner and <strong class='payment-email'>{{ email }}</strong>.",
        "PAYMENT_EDITOR_CHANGE_AMOUNT": "Change amount",
        "PAYMENT_MANAGER_TERMS": "By paying you are agreeing to Invoice2go <a href='https://invoice.2go.com/paymentterms' target='_blank' class='payment-terms'>Payment Terms</a> and <a href='https://invoice.2go.com/privacyInline/' target='_blank' class='privacy-policy'>Privacy Policy</a>.",
        "PAYMENT_MANAGER_PAY": "Pay {{ currencyCode }} {{ amount }}",
        "PAID_DETAILS": "This invoice was fully paid on <time class='paid-time'><strong>{{ paidTime }}</strong></time>",
        "PAID_HEADER": "Invoice fully paid"
      }
    };

    expected = {
      "STATEMENT": {
        "ONLINE_STATEMENT": {
          "HEADER": {
            "N_DOCUMENT": "N Documents",
          },
        },
        "SELECT_INVOICE": "Select an invoice to continue making payment.",
      },
      "MAIN": {
        "LOADER_TEXT_TEXT": "Loading invoice...",
        "LOADER_TEXT_PAYPAL": "Contacting PayPal...",
        "PAYMENT_SUCCESS_EMAIL_CONFIRMATION": "A confirmation email has been sent to the business owner and <strong class='payment-email'>{{ email }}</strong>.",
        "PAYMENT_EDITOR_CHANGE_AMOUNT": "Change amount",
        "PAYMENT_MANAGER_TERMS": "By paying you are agreeing to Invoice2go <a href='https://invoice.2go.com/paymentterms' target='_blank' class='payment-terms'>Payment Terms</a> and <a href='https://invoice.2go.com/privacyInline/' target='_blank' class='privacy-policy'>Privacy Policy</a>.",
        "PAYMENT_MANAGER_PAY": "Pay {{ currencyCode }} {{ amount }}",
        "PAID_DETAILS": "This invoice was fully paid on <time class='paid-time'><strong>{{ paidTime }}</strong></time>",
        "PAID_HEADER": "Invoice fully paid"
      }
    };

  });

  it('should combine translation request from all the files', () => {
    base = merge(merge(base, fix), feature);
    expect(base).to.be.eql(expected, 'All the changes are not merged');
  });
});