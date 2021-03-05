import React from 'react';

export const Panel = (props) => {

  React.useEffect(() => {
    console.log(props)
  }, [props])

  console.log(props.data?.items)
  const { Body, Madera, plastico_blanco } = props?.data?.items || {Body: null, Madera: null, plastico_blanco: null};

  const getPart = () => {
    switch (props.data?.current) {
      case 'Body':
        return 'The body'
      case 'plastico_blanco':
        return 'The cap'
      case 'Madera':
        return 'The neck'
      case 'Metal':
        return 'Strings and others'
      default:
        return 'none'
    }
  }

  return (
    <div className='panel'>
      <h2>{'Guitar colors:'}</h2>
      <h5>{'Current: ', getPart()}</h5>
      <ul>
        <li style={{color: !Body || Body === '#fffefe' ? '#000' : Body}}>
          {'Body: ' + (Body ? Body : '')}
        </li>
        <li style={{ color: !plastico_blanco || plastico_blanco === '#fffefe' ? '#000000' : plastico_blanco }}>
          {'Cap: ' + (plastico_blanco ? plastico_blanco : '')}
        </li>
        <li style={{ color: !Madera || Madera ===' #fffefe' ? '#000' : Madera }}>
          {'Neck: ' + (Madera ? Madera : '')}
        </li>
      </ul>
    </div>
  )
}
