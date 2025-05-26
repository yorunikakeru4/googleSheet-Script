import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styles from '../styles/HomePage.module.css';

interface Bike {
  id: string;
  status: 'Active' | 'Inactive';
}

function BikeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={active ? styles['status-active'] : styles['status-inactive']}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <circle cx="8" cy="24" r="4" />
      <circle cx="24" cy="24" r="4" />
      <path d="M8 24L18 8M18 8H22M18 8L24 24M13 16H21" />
    </svg>
  );
}

interface HomePageProps {
  bikes: Bike[];
}

export default function HomePage({ bikes }: HomePageProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Bicycles</div>
      <div className={styles.grid}>
        {bikes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: '#aaa' }}>
            No bicycles found
          </div>
        ) : (
          bikes.map(bike => (
            <Link
              key={bike.id}
              href={`/bike/${bike.id}`}
              className={styles.iconCard}
              tabIndex={0}
              aria-label={`Bicicleta ${bike.id}, ${bike.status === 'Active' ? 'active' : 'inactive'}`}
            >
              <span className={styles.bikeIcon}>
                <BikeIcon active={bike.status === 'Active'} />
              </span>
              <span className={styles.bikeId}>{bike.id}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api`);
    if (!res.ok) return { props: { bikes: [] } };
    const bikes = await res.json();
    return { props: { bikes } };
  } catch {
    return { props: { bikes: [] } };
  }
};
