import './File.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import removeObjectKeys from '../../lib/removeObjectKeys';
import getClassName from '../../helpers/getClassName';
import Button from '../Button/Button';

const baseClassNames = getClassName('File');

export default class File extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: null
    };
  }
  static propTypes = {
    style: PropTypes.object,
    label: PropTypes.string,
    alignment: PropTypes.oneOf(['left', 'center', 'right']),
    appearance: PropTypes.oneOf(['primary', 'default', 'danger']),
    onChange: PropTypes.func
  };
  static defaultProps = {
    style: {},
    label: 'Choose file',
    alignment: 'left',
    appearance: 'default',
    onChange: () => {}
  };
  changeHandler = e => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
  render () {
    const { style, label, alignment, appearance } = this.props;

    return (
      <Button
        alignment={alignment}
        appearance={appearance}
        onClick={() => {}}
        className={baseClassNames}
        style={style}
        component="div"
      >
        <label className="File__in">
          <input
            className="File__self"
            type="file"
            onChange={this.changeHandler}
            {...removeObjectKeys(this.props, ['onChange', 'style', 'label', 'alignment', 'appearance'])}
          />
        </label>
        {label}
      </Button>
    );
  }
}
