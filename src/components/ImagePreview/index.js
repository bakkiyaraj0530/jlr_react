import React, { Component, PropTypes } from 'react';
import cssModules from 'react-css-modules';
import styles from './imagePreview.scss';

const previewClose = require('assets/images/icon-back-arrow.svg');

@cssModules(styles)
class ImagePreview extends Component {

  render() {
    const { imageSource, previewState, closePreview } = this.props;
    const previewClass = previewState ? 'preview show-div' : 'preview hide-div';

    return (
      <div className={ previewClass }>
        <div className="preview-container">
          <div className="preview-header">
            <img src={ previewClose } alt="Close Preview" className="preview-close" onClick={ closePreview } />
          </div>

          <div className="preview-content">
            <img src={ imageSource } />
            <div className="image-delete capitalize form-button-icon"><span>Delete</span></div>
          </div>
        </div>
      </div>
     );
  }
}

ImagePreview.propTypes = {
  imageSource: PropTypes.string.isRequired,
  closePreview: PropTypes.func.isRequired,
  previewState: PropTypes.bool.isRequired
};

export default ImagePreview;
