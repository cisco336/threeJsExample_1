import React from 'react';

export class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='panel'>
        {'Guitar materials:'}
        <ul>
          <li>
            {'Body: '}
          </li>
          <li>
            {'Cap: '}
          </li>
          <li>
            {'Neck: '}
          </li>
        </ul>
      </div>
    )
  }
}
