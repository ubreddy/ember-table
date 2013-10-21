(function() {
  window.App = Ember.Application.create();

  App.TableEditableExample = Ember.Namespace.create();

  App.TableEditableExample.EditableTableCell = Ember.Table.TableCell.extend({
    classNames: 'editable-table-cell',
    templateName: 'editable-table-cell',
    isEditing: false,
    type: 'text',
    innerTextField: Ember.TextField.extend({
      typeBinding: 'parentView.type',
      valueBinding: 'parentView.cellContent',
      didInsertElement: function() {
        return this.$().focus();
      },
      blur: function(event) {
        return this.set('parentView.isEditing', false);
      }
    }),
    onRowContentDidChange: Ember.observer(function() {
      return this.set('isEditing', false);
    }, 'rowContent'),
    click: function(event) {
      this.set('isEditing', true);
      return event.stopPropagation();
    }
  });

  App.TableEditableExample.DatePickerTableCell = App.TableEditableExample.EditableTableCell.extend({
    type: 'date'
  });

  App.TableEditableExample.RatingTableCell = Ember.Table.TableCell.extend({
    classNames: 'rating-table-cell',
    templateName: 'rating-table-cell',
    didInsertElement: function() {
      this._super();
      return this.onRowContentDidChange();
    },
    applyRating: function(rating) {
      var span;
      this.$('.rating span').removeClass('active');
      span = this.$('.rating span').get(rating);
      return $(span).addClass('active');
    },
    click: function(event) {
      var rating;
      rating = this.$('.rating span').index(event.target);
      if (rating === -1) {
        return;
      }
      this.get('column').setCellContent(this.get('rowContent'), rating);
      return this.applyRating(rating);
    },
    onRowContentDidChange: Ember.observer(function() {
      return this.applyRating(this.get('cellContent'));
    }, 'cellContent')
  });

  App.ApplicationView = Ember.View.extend({
    classNames: 'ember-app',
    templateName: 'application'
  });

  App.ApplicationController = Ember.Controller.extend({
    numRows: 100,
    columns: Ember.computed(function() {
      var columnNames, columns, dateColumn, ratingColumn;
      columnNames = ['open', 'close'];
      dateColumn = Ember.Table.ColumnDefinition.create({
        columnWidth: 100,
        headerCellName: 'Date',
        tableCellViewClass: 'App.TableEditableExample.DatePickerTableCell',
        getCellContent: function(row) {
          return row['date'].toString('yyyy-MM-dd');
        },
        setCellContent: function(row, value) {
          return row['date'] = value;
        }
      });
      ratingColumn = Ember.Table.ColumnDefinition.create({
        columnWidth: 150,
        headerCellName: 'Analyst Rating',
        tableCellViewClass: 'App.TableEditableExample.RatingTableCell',
        contentPath: 'rating',
        setCellContent: function(row, value) {
          return row['rating'] = value;
        }
      });
      columns = columnNames.map(function(key, index) {
        var name;
        name = key.charAt(0).toUpperCase() + key.slice(1);
        return Ember.Table.ColumnDefinition.create({
          columnWidth: 100,
          headerCellName: name,
          tableCellViewClass: 'App.TableEditableExample.EditableTableCell',
          getCellContent: function(row) {
            return row[key].toFixed(2);
          },
          setCellContent: function(row, value) {
            return row[key] = +value;
          }
        });
      });
      columns.unshift(ratingColumn);
      columns.unshift(dateColumn);
      return columns;
    }).property(),
    content: Ember.computed(function() {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = this.get('numRows'); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(num, idx) {
        return {
          index: idx,
          date: Date.today().add({
            days: idx
          }),
          open: Math.random() * 100 - 50,
          close: Math.random() * 100 - 50,
          rating: Math.round(Math.random() * 4)
        };
      });
    }).property('numRows')
  });

}).call(this);
