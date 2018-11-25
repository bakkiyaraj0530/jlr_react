import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { downloadexl } from '../../actions/notificationsActions';


class Files extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      previous: false,
      blob: null
    };
    this.getBlob = this.getBlob.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(downloadexl(this.props.sdData.id, this.getBlob));
  }

  componentDidUpdate() {
    const { dispatch } = this.props;
    if (this.state.isReady) {
      dispatch(pushState(null, 'opensd/' + this.props.sdData.id));
    }
  }

  getBlob(stream, fileName) {
    const { dispatch } = this.props;
    if (window.cordova) {
      return this.getMobileBlob(stream.response, fileName);
    }
    if (!stream) {
      return dispatch(pushState(false, '/errorpage'));
    }
    this.setState({ isReady: true });
    // For a Windows IE Browser, this allows to save the PDF and open it.
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(stream.response, fileName);
    } else {
      const data = new Blob([stream.response], { type: 'text/csv' });
      const csvURL = window.URL.createObjectURL(data);
      const tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', fileName);
      tempLink.click();
    }
  }

  getMobileBlob(stream, fileName) {
    const pathToFile = window.cordova.file.documentsDirectory;
    document.addEventListener('deviceready', function registered() {
      window.resolveLocalFileSystemURL(window.cordova.file.documentsDirectory, function gotDir(dir) {
        dir.getFile(fileName, { create: true }, function gotfile(file) {
          file.createWriter(function getWritter(fileWriter) {
            fileWriter.seek(fileWriter.length);
            const data = new Blob([stream], { type: 'text/csv' });
            fileWriter.write(data);
          }, function gotError(err) {
            console.log('Write failed: ' + err);
          });
        });
      });
    });

    document.addEventListener('deviceready', function registered() {
      window.cordova.plugins.email.isAvailable(
        function (isAvailable) {
          if (isAvailable) {
            window.cordova.plugins.email.open({
              subject: fileName,
              attachments: [pathToFile + fileName]
            });
          } else {
            alert('Email composer not available');
          }
        }
      );
    });
    this.setState({ isReady: true });
  }

  render() {
    return (
      <div>
      <h2 className="middle-align">Downloading...</h2>
      </div>
    );
  }
}


Files.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  user: React.PropTypes.object,
  location: React.PropTypes.object,
  sdData: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    sdData: state.worklistReducer.currentWorklist,
    location: state.router.location,
    user: state.authReducer.userAuth,
  };
}
export default connect(mapStateToProps)(Files);
