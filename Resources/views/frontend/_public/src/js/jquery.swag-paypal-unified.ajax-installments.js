;(function($, window) {
    'use strict';

    $.plugin('swagPayPalUnifiedAjaxInstallments', {
        defaults: {
            /**
             * The URL for the ajax request that requests the financing data.
             *
             * @type string
             */
            paypalInstallmentsRequestUrl: '',

            /**
             * The price of the product on which base the details are being requested.
             *
             * @type float
             */
            paypalInstallmentsProductPrice: null,

            /**
             * The selector for the paypal loading indicator.
             *
             * @type string
             */
            paypalLoadingIndicatorSelector: '.paypal-unified-installments--loading-indicator',

            /**
             * The selector for the paypal installments container.
             * The result of the ajax request will be displayed in this element.
             *
             * @type string
             */
            paypalInstallmentsContainerSelector: '.paypal--installments',

            /**
             * The type of the target page.
             * This value is required for the template to load correctly.
             *
             * @type string
             */
            paypalInstallmentsPageType: '',

            /**
             * A value indicating if a complete list of all options or just the cheapest one
             * should be received.
             *
             * @type boolean
             */
            paypalInstallmentsRequestCompleteList: false,

            /**
             * The URL for the complete list ajax request.
             *
             * @type string
             */
            paypalInstallmentsRequestCompleteListUrl: ''
        },

        /**
         *
         */
        init: function () {
            var me = this;
            me.applyDataAttributes();

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/init', me);

            me.requestDetails();
        },

        /**
         * Requests the financing details from the installments controller.
         *
         * @private
         * @method requestDetails
         */
        requestDetails: function () {
            var me = this;

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/beforeRequest', me);

            if (me.opts.paypalInstallmentsRequestCompleteList) {
                me.requestCompleteList();
            } else {
                me.requestCheapestRate();
            }

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/afterRequest', me);
        },

        /**
         * Requests only the cheapest rate from the API.
         *
         * @private
         * @method requestCheapestRate
         */
        requestCheapestRate: function () {
            var me = this;

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/requestCheapestRate', me);

            $.ajax({
                url: me.opts.paypalInstallmentsRequestUrl,
                data: {
                    productPrice: me.opts.paypalInstallmentsProductPrice,
                    pageType: me.opts.paypalInstallmentsPageType
                },
                method: 'GET',
                success: $.proxy(me.detailsAjaxCallbackSuccess, me),
                error: $.proxy(me.detailsAjaxCallbackError, me)
            });
        },

        /**
         * Requests all rates for the provided price from the API.
         */
        requestCompleteList: function () {
            var me = this;

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/requestCompleteList', me);

            $.ajax({
                url: me.opts.paypalInstallmentsRequestCompleteListUrl,
                data: {
                    productPrice: me.opts.paypalInstallmentsProductPrice
                },
                method: 'GET',
                success: $.proxy(me.detailsAjaxCallbackSuccess, me),
                error: $.proxy(me.detailsAjaxCallbackError, me)
            });
        },

        /**
         * Will be triggered when the ajax callback succeeds.
         *
         * @private
         * @method detailsAjaxCallbackSuccess
         * @param { Object } response
         */
        detailsAjaxCallbackSuccess: function (response) {
            var me = this,
                $loadingIndicator = $(me.opts.paypalLoadingIndicatorSelector),
                $installmentsContainer = $(me.opts.paypalInstallmentsContainerSelector);

            $installmentsContainer.html(response);

            $loadingIndicator.prop('hidden', true);

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/ajaxSuccess', me);
        },

        /**
         * Will be triggered when the ajax callback fails.
         *
         * @private
         * @method detailsAjaxCallbackError
         */
        detailsAjaxCallbackError: function () {
            var me = this,
                $loadingIndicator = $(me.opts.paypalLoadingIndicatorSelector);

            $loadingIndicator.prop('hidden', true);

            $.publish('plugin/swagPayPalUnifiedAjaxInstallments/ajaxError', me);
        }
    });

    $(function() {
        StateManager.addPlugin('*[data-paypalAjaxInstallments="true"]', 'swagPayPalUnifiedAjaxInstallments');
    });
})(jQuery, window);
