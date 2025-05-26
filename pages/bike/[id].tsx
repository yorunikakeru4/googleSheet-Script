import { useState } from 'react';
import styles from '../../styles/BikePage.module.css';
import Link from 'next/link';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import formateDate from '../../utils/formateDate';

interface Bike {
  id: string;
  brand: string;
  user: string;
  status: string;
}

interface BikePageProps {
  bike: Bike | null;
}

export default function BikePage({ bike }: BikePageProps) {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);
  const router = useRouter();

  if (!bike) return <div className={styles.container}>Bike not found</div>;

  const isActive = bike.status && bike.status.trim().toLowerCase() === 'active';

  async function handleSetInactive(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const logRes = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bike.id,
          status: 'Returned',
          brand: bike.brand,
          user: bike.user,
          date: formateDate(new Date())
        }),
      });
      if (!logRes.ok) throw new Error('Failed to log status change');

      const updateRes = await fetch(`/api/bike/${bike.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Inactive', user: '' }),
      });
      if (!updateRes.ok) throw new Error('Failed to update bike status');

      router.push('/');
    } catch (e) {
      setError('Error updating the status');
    }
    setLoading(false);
  }

  async function handleSetActive(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!userInput.trim()) {
      setError('Please enter a user name');
      setInputError(true);
      return;
    }
    setLoading(true);
    setError(null);
    setInputError(false);
    try {
      const updateRes = await fetch(`/api/bike/${bike.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Active', user: userInput }),
      });
      if (!updateRes.ok) throw new Error('Failed to update bike status');

      const logRes = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bike.id,
          status: 'Added',
          brand: bike.brand,
          user: userInput,
          date: formateDate(new Date()),
        }),
      });
      if (!logRes.ok) throw new Error('Failed to log status change');

      router.push('/');
    } catch (e) {
      setError('Error updating the status');
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bicycle #{bike.id}</h1>
      <div className={styles.info}>
        <span className={isActive ? styles['status-active'] : styles['status-inactive']}>
          Status: {isActive ? 'Active' : 'Inactive'}
        </span>
        <span className={styles.brand}>Brand: {bike.brand}</span>
        <span className={styles.user}>User: {bike.user || '—'}</span>
      </div>
      {error && (
        <div style={{ color: '#f34e4e', marginBottom: 8, fontWeight: 600 }} aria-live="assertive">
          {error}
        </div>
      )}
      {isActive ? (
        <button
          onClick={handleSetInactive}
          disabled={loading}
          className={`${styles.button} ${styles.red}`}
        >
          Mark as Inactive
        </button>
      ) : (
        <form onSubmit={handleSetActive}>
          <input
            className={`${styles.inputUser} ${inputError ? styles.inputError : ''}`}
            placeholder="User Name"
            value={userInput}
            onChange={e => {
              setUserInput(e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ''));
              if (error) setError(null);
              if (inputError) setInputError(false);
            }}
            disabled={loading}
            aria-invalid={!!error || inputError}
            aria-describedby={error || inputError ? "username-error" : undefined}
          />
          <button
            type="submit"
            disabled={loading} // !userInput.trim() убрано, чтобы всегда можно было нажать
            className={`${styles.button} ${styles.green}`}
          >
            Mark as Active
          </button>
        </form>
      )}
      <Link href="/" className={styles.backBtn}>Back</Link>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<BikePageProps> = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.query;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bike/${id}`);
    if (!res.ok) return { props: { bike: null } };
    const bike: Bike = await res.json();
    return { props: { bike } };
  } catch {
    return { props: { bike: null } };
  }
};
