import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './worklist.scss';
import { Link } from 'react-router';
import { filterWorklistDataSupplier, filterWorklistDatasSDType, searchWorklistDataOffline, searchWorklistDataOnline, resetWorlist, sortAlphabetical, sortDate } from '../../actions/worklistActions';
import { connect } from 'react-redux';
import SearchForm from '../../components/SearchForm/SearchForm';
const upDownArrows = require('assets/images/arrows-up-down.svg');
const upDownArrowsSelected = require('assets/images/arrows-up-down-selected.svg');

@cssModules(styles)
class Worklist extends Component {
  constructor() {
    super();
    this.state = {
      keyword: '',
      selected: 'na',
      filterStatus: null,
      resetSearch: false,
      moreInfoClicked: '',
      supplierNameArrow: false,
      siteCodeArrow: false,
      assessmentTypeArrow: false,
      statusArrow: false,
      idArrow: false,
      staEngineerArrow: false,
      staManagerArrow: false,
      statusChangedArrow: false,
      progressArrow: false,
      supplierNameOrder: 'asc',
      siteCodeOrder: 'asc',
      assessmentTypeOrder: 'asc',
      statusOrder: 'asc',
      idOrder: 'asc',
      staEngineerOrder: 'asc',
      statusChangedOrder: 'asc',
      progressOrder: 'asc'
    };

    this._onSelect = this._onSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.moreInfoActive = this.moreInfoActive.bind(this);
  }

  componentDidUpdate() {
    this.changeResetSearchState();
  }

  handleSort(columnName) {
    const selectedColumn = columnName;
    const { dispatch } = this.props;
    let orderBy;
    this.setState({
      supplierNameArrow: false,
      siteCodeArrow: false,
      assessmentTypeArrow: false,
      statusArrow: false,
      idArrow: false,
      staEngineerArrow: false,
      staManagerArrow: false,
      statusChangedArrow: false,
      progressArrow: false
    });

    switch (columnName) {

      case 'SupplierName':
        orderBy = this.state.supplierNameOrder;
        this.setState({ supplierNameArrow: true });
        if (orderBy === 'asc') {
          this.setState({ supplierNameOrder: 'desc' });
        } else {
          this.setState({ supplierNameOrder: 'asc' });
        }
        dispatch(sortAlphabetical(selectedColumn, orderBy));
        break;

      case 'SiteCode':
        orderBy = this.state.siteCodeOrder;
        this.setState({ siteCodeArrow: true });
        if (orderBy === 'asc') {
          this.setState({ siteCodeOrder: 'desc' });
        } else {
          this.setState({ siteCodeOrder: 'asc' });
        }
        dispatch(sortAlphabetical(selectedColumn, orderBy));
        break;

      case 'AssessmentType':
        orderBy = this.state.assessmentTypeOrder;
        this.setState({ assessmentTypeArrow: true });
        if (orderBy === 'asc') {
          this.setState({ assessmentTypeOrder: 'desc' });
        } else {
          this.setState({ assessmentTypeOrder: 'asc' });
        }
        dispatch(sortAlphabetical(selectedColumn, orderBy));
        break;

      case 'Status':
        orderBy = this.state.statusOrder;
        this.setState({ statusArrow: true });
        if (orderBy === 'asc') {
          this.setState({ statusOrder: 'desc' });
        } else {
          this.setState({ statusOrder: 'asc' });
        }
        dispatch(sortAlphabetical(selectedColumn, orderBy));
        break;

      case 'ID':
        orderBy = this.state.idOrder;
        this.setState({ idArrow: true });
        if (orderBy === 'asc') {
          this.setState({ idOrder: 'desc' });
        } else {
          this.setState({ idOrder: 'asc' });
        }
        dispatch(sortAlphabetical(selectedColumn, orderBy));
        break;

      case 'STAEngineer':
        orderBy = this.state.staEngineerOrder;
        this.setState({ staEngineerArrow: true });
        if (orderBy === 'asc') {
          this.setState({ staEngineerOrder: 'desc' });
        } else {
          this.setState({ staEngineerOrder: 'asc' });
        }
        dispatch(sortAlphabetical(selectedColumn, orderBy));
        break;

      case 'STAManager':
        this.setState({ staManagerArrow: true });
        break;

      case 'StatusChanged':
        orderBy = this.state.statusChangedOrder;
        this.setState({ statusChangedArrow: true });
        if (orderBy === 'asc') {
          this.setState({ statusChangedOrder: 'desc' });
        } else {
          this.setState({ statusChangedOrder: 'asc' });
        }
        dispatch(sortDate(selectedColumn, orderBy));
        break;

      case 'Progress':
        this.setState({ progressArrow: true });
        break;

      default :
        this.setState({
          supplierNameArrow: false,
          siteCodeArrow: false,
          assessmentTypeArrow: false,
          statusArrow: false,
          idArrow: false,
          staEngineerArrow: false,
          staManagerArrow: false,
          statusChangedArrow: false,
          progressArrow: false
        });
    }
  }

  changeResetSearchState() {
    if (this.state.resetSearch === true) {
      this.setState({ resetSearch: false });
    }
  }

  _onSelect(e) {
    this.setState({ selected: e.target.value });
    this.setState({ filterStatus: this.state.filterStatus === 0 ? 0 : null });
  }

  handleChange(e) {
    this.setState({ keyword: e.target.value });
    this.setState({ filterStatus: this.state.filterStatus === 1 ? 1 : null });
  }

  handleSubmit() {
    const keywordVal = this.state.keyword.trim();
    const selectedOption = this.state.selected;
    const { dispatch } = this.props;
    if (keywordVal === '' || keywordVal === null) {
      this.setState({ filterStatus: 0 });
    } else if (selectedOption === 'na') {
      this.setState({ filterStatus: 1 });
    } else {
      if (keywordVal && keywordVal.trim().length > 0) {
        if (selectedOption === 'supplier') {
          dispatch(filterWorklistDataSupplier(keywordVal));
        } else if (selectedOption === 'sdType') {
          dispatch(filterWorklistDatasSDType(keywordVal));
        }
      }
    }
  }

  handleReset() {
    this.setState({
      keyword: '',
      selected: 'na',
      filterStatus: null,
      resetSearch: true
    });
    const { dispatch } = this.props;
    dispatch(resetWorlist());
  }

  handleSearchSubmit(e) {
    const { dispatch } = this.props;
    const formValues = JSON.stringify(e);
    if (formValues !== '{}') {
      if (window.cordova) {
        if (window.navigator.onLine) {
          dispatch(searchWorklistDataOnline(e));
        } else {
          dispatch(searchWorklistDataOffline(e));
        }
      } else {
        dispatch(searchWorklistDataOnline(e));
      }
    }
  }

  handleMoreInfo(clicked) {
    this.setState({ moreInfoClicked: clicked });
  }

  closeMoreInfo() {
    this.setState({ moreInfoClicked: '' });
  }

  moreInfoActive(value) {
    return value === this.state.moreInfoClicked ? true : false;
  }

  render() {
    const { searchIsOpen, toggleSearch } = this.props;
    const obj = this.props.worklist;
    const isEmpty = obj.length;
    const Empty = (isEmpty === undefined || isEmpty === 0) ? false : true;
    const searchStyle = (searchIsOpen) ? 'show-div' : 'hide-div';
    const searchHeaderStyle = (searchIsOpen) ? 'search-open-header ' : 'search-close-header ';
    const percentageComplete = '50';
    const progressClass = percentageComplete === '100' ? 'worklist__data__progress completed' : 'worklist__data__progress';

    return (
      <div className="worklist-container" searchIsOpen={ searchIsOpen }>
        <div className="container filter-container">
          <div className="filter-text-container">
            <input
              type="text"
              className="filter-text"
              placeholder="Keyword filter..."
              value={ this.state.keyword }
              onChange={ this.handleChange }/>
              { this.state.filterStatus === 0 && <div className="errorMessage filterError">Required</div> }
          </div>

          <div className="filter-select-container">
            <select name="filters" className="filter-select" onChange={ this._onSelect } value={this.state.selected}>
              <option value="na">Filter within...</option>
              <option value="supplier">Supplier</option>
              <option value="sdType">Supplier Diagnosis Type</option>
            </select>
            { this.state.filterStatus === 1 && <div className="errorMessage filterError">Required</div> }
          </div>

          <button className="filter-button capitalize" onClick={ this.handleSubmit }>Filter</button>
          <button className="filter-reset-button capitalize" onClick={ this.handleReset }>Reset Worklist</button>
          <Link to="createSuppDiagnostic" className="new-button capitalize">+ New</Link>

          <div className="order-by-select-container">
            <select name="orderBy" className="filter-select">
              <option value="na">Order by...</option>
              <option value="SupplierName">Supplier Name</option>
              <option value="SiteCode">Site Code</option>
              <option value="AssessmentType">Assessment Type</option>
              <option value="Status">Status</option>
              <option value="ID">ID</option>
              <option value="STAEngineer">STA Engineer</option>
              <option value="STAManager">STA Manager</option>
              <option value="StatusChanged">Status Changed</option>
              <option value="Progress">Progress</option>
            </select>
          </div>
        </div>

        <div className="search-container">
          <div className={ searchHeaderStyle + 'search-header capitalize' } onClick={ toggleSearch }>Search</div>

          <div className={ searchStyle }>
            <SearchForm onSubmit={ this.handleSearchSubmit } resetSearch ={ this.state.resetSearch }/>
          </div>
        </div>
        {
          Empty ?
          <div className="container worklist-content">
            <div className="worklist-table-header center-text">
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'SupplierName')}>
                <div>Supplier Name&nbsp;&nbsp;</div>
                 { this.state.supplierNameArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'SiteCode')}>
                <div>Site Code &nbsp;&nbsp;</div>
                { this.state.siteCodeArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'AssessmentType')}>
                <div>Assessment Type&nbsp;&nbsp;</div>
                { this.state.assessmentTypeArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'Status')}>
                <div>Status&nbsp;&nbsp;</div>
                { this.state.statusArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'ID')}>
                <div>ID&nbsp;&nbsp;</div>
                { this.state.idArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'STAEngineer')}>
                <div>STA Engineer&nbsp;&nbsp;</div>
                { this.state.staEngineerArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'STAManager')}>
                <div>STA Manager&nbsp;&nbsp;</div>
                { this.state.staManagerArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'StatusChanged')}>
                <div>Status Changed&nbsp;&nbsp;</div>
                { this.state.statusChangedArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item capitalize" onClick={this.handleSort.bind(this, 'Progress')}>
                <div>Progress&nbsp;&nbsp;</div>
                { this.state.progressArrow ? (<img src={ upDownArrowsSelected }/>) : (<img src={ upDownArrows }/>)}
              </div>
              <div className="worklist-table-header-item worklist-table-view capitalize"></div>
            </div>
            {
              obj.map(function showList(item, key) {
                return (
                  <div className="worklist-row" key={ key }>
                    <div className="worklist-item">
                      <div className="worklist-item-label capitalize">Supplier Name</div>
                      <div className="worklist-item-value capitalize">{ item.supplierBusinessName }</div>
                    </div>

                    <div className="worklist-item">
                      <div className="worklist-item-label capitalize">Manufacturing Site Code</div>
                      <div className="worklist-item-value capitalize">{ item.manufacturerSiteCode }</div>
                    </div>

                    <div className="worklist-item">
                      <div className="worklist-item-label capitalize">Assessment Type</div>
                      <div className="worklist-item-value capitalize">{ item.assessmentType }</div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-more-button hide-div' : 'worklist-more-button show-div' } onClick={ this.handleMoreInfo.bind(this, item.id) }>+ More</div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-item show' : 'worklist-item hide-for-small-only hide-for-medium-only' }>
                      <div className="worklist-item-label capitalize">Status</div>
                      <div className="worklist-item-value capitalize">{ item.status }</div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-item show' : 'worklist-item hide-for-small-only hide-for-medium-only' }>
                      <div className="worklist-item-label capitalize">ID</div>
                      <div className="worklist-item-value capitalize">{ item.id }</div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-item show' : 'worklist-item hide-for-small-only hide-for-medium-only' }>
                      <div className="worklist-item-label capitalize">STA Engineer</div>
                      <div className="worklist-item-value capitalize">{ item.assignee }</div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-item show' : 'worklist-item hide-for-small-only hide-for-medium-only' }>
                      <div className="worklist-item-label capitalize">STA Manager</div>
                      <div className="worklist-item-value capitalize">{ item.manager }</div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-item show' : 'worklist-item hide-for-small-only hide-for-medium-only' }>
                      <div className="worklist-item-label capitalize">Status Change Date</div>
                      <div className="worklist-item-value capitalize">{ item.assessmentDate }</div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-item show' : 'worklist-item hide-for-small-only hide-for-medium-only' }>
                      <div className="worklist-item-label capitalize">Progress</div>
                      <div className="worklist-item-value capitalize">
                      <div className="progress-bar">
                        <div className={ progressClass }>
                          <div style={{ width: percentageComplete + '%' }} ></div>
                        </div>
                      </div>
                      </div>
                    </div>

                    <div className={ this.moreInfoActive(item.id) ? 'worklist-more-button show-div' : 'worklist-more-button hide-div' } onClick={ this.closeMoreInfo.bind(this) }>- Less</div>

                    <Link to={ 'opensd/' + item.id } className="worklist-item worklist-view capitalize">View</Link>
                  </div>
                );
              }, this)
            }
          </div>
         : ''
        }
      </div>
    );
  }
}

Worklist.propTypes = {
  dispatch: PropTypes.func.isRequired,
  worklist: PropTypes.object,
  searchIsOpen: PropTypes.bool,
  toggleSearch: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func,
  resetSearch: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    state
  };
}

export default connect(mapStateToProps)(Worklist);
