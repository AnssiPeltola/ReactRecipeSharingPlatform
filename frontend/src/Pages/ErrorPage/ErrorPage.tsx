import React from 'react';
import styles from './ErrorPage.module.scss';
import { Link } from 'react-router-dom';

const ErrorPage = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Sivua ei löydetty</h1>
      <Link to='/'>
        <div className={styles.return}>Palaa etusivulle</div>
      </Link>
    </div>
  );
};

export default ErrorPage;