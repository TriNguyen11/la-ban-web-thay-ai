import React from 'react';
import Lang from '@floorplan/system/language';

function NoneOfResults(props) {
  return (
    <div className={props.className ? props.className : "d-flex justify-content-center align-items-center w-100 h-100 p-3"}>
      {props.title ? props.title : Lang.t('None Of Result')}
    </div>
  );
}

export default NoneOfResults;
