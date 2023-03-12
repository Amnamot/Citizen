const inputList = {
  values: [],
  getValues: function () {
    return this.values.sort();
  },
  render: function (selector, id = "", value = null, type = "select") {
    if (value) {
      this.values = value;
    }
    if (type == "input") {
      return $(selector).autocomplete({
        source: this.getValues(),
        classes: {
          "ui-autocomplete": `autocomplete__${id} autoCompliteList standartText`,
        },
        open: function (event, ui) {
          $(`.autocomplete__${id}`).width($(event.target).width() - 16);
          $(`.autocomplete__${id}`).css(
            "top",
            +$(`.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
          );
        },
      });
    }

    $(selector).append(`<option value=""></option>`);
    this.values.forEach((elm) => {
      $(selector).append(`<option value="${elm}">${elm}</option>`);
    });

    $.widget("custom.combobox", {
      _create: function () {
        this.wrapper = $("<span>")
          .addClass("custom-combobox")
          .insertAfter(this.element);

        this.element.hide();
        this._createAutocomplete();
      },

      _createAutocomplete: function () {
        var selected = this.element.children(":selected"),
          value = selected.val() ? selected.text() : "";

        this.input = $("<input>")
          .appendTo(this.wrapper)
          .val(value)
          .attr("title", "")
          .addClass(
            "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left standartText"
          )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: this._source.bind(this),
            classes: {
              "ui-autocomplete": `autocomplete__${id} autoCompliteList standartText`,
            },
            open: function (event, ui) {
              $(`.autocomplete__${id}`).width($(event.target).width() - 16);
              $(`.autocomplete__${id}`).css(
                "top",
                +$(`.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
              );
            },
          });

        this._on(this.input, {
          autocompleteselect: function (event, ui) {
            ui.item.option.selected = true;

            this._trigger("select", event, {
              item: ui.item.option,
            });
          },

          autocompletechange: "_removeIfInvalid",
        });

        this.input.on("focus", (e) => {
          console.log(1);
          this.input.autocomplete("search", "");
        });
      },

      _source: function (request, response) {
        var matcher = new RegExp(
          $.ui.autocomplete.escapeRegex(request.term),
          "i"
        );
        response(
          this.element.children("option").map(function () {
            var text = $(this).text();
            if (this.value && (!request.term || matcher.test(text)))
              return {
                label: text,
                value: text,
                option: this,
              };
          })
        );
      },

      _removeIfInvalid: function (event, ui) {
        if (ui.item) {
          return;
        }

        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children("option").each(function () {
          if ($(this).text().toLowerCase() === valueLowerCase) {
            this.selected = valid = true;
            return false;
          }
        });

        if (valid) {
          return;
        }

        this.input
          .val("")
          .attr("placeholder", value + " didn't match any item");
        this.element.val("");
        this._delay(function () {
          this.input.attr("placeholder", "");
        }, 2500);
        this.input.autocomplete("instance").term = "";
      },

      _destroy: function () {
        this.wrapper.remove();
        this.element.show();
      },
    });

    $(selector).combobox({
      classes: {
        "ui-autocomplete": "highlight",
      },
    });
  },
};
