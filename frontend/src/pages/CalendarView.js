import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getReservations } from '../services/api';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { fr },
});

const STATUT_COLORS = {
  'confirmé': '#16a34a',
  'annulé': '#dc2626',
};

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getReservations();
        const mapped = res.data.map(r => {
          const [year, month, day] = r.date.split('T')[0].split('-');
          const [hh, mm] = r.heure.split(':');
          const start = new Date(year, month - 1, day, hh, mm);
          const end = new Date(year, month - 1, day, parseInt(hh) + 1, mm);
          return {
            id: r.id,
            title: `${r.nom} — ${r.service}`,
            start,
            end,
            statut: r.statut,
            resource: r,
          };
        });
        setEvents(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: STATUT_COLORS[event.statut] || '#1a56db',
      borderRadius: '6px',
      border: 'none',
      color: 'white',
      fontSize: '0.8rem',
    }
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📆 Calendrier des réservations</h2>

      <div style={styles.legend}>
        <span style={{ ...styles.dot, backgroundColor: '#16a34a' }} /> Confirmée
        <span style={{ ...styles.dot, backgroundColor: '#dc2626', marginLeft: '1rem' }} /> Annulée
      </div>

      <div style={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelected(event.resource)}
          messages={{
            next: 'Suivant', previous: 'Précédent', today: "Aujourd'hui",
            month: 'Mois', week: 'Semaine', day: 'Jour', agenda: 'Agenda',
            noEventsInRange: 'Aucune réservation sur cette période.',
          }}
        />
      </div>

      {/* Popup détail */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.popup} onClick={e => e.stopPropagation()}>
            <h3 style={styles.popupTitle}>Détails de la réservation</h3>
            <p><strong>Client :</strong> {selected.nom}</p>
            <p><strong>Service :</strong> {selected.service}</p>
            <p><strong>Date :</strong> {new Date(selected.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure :</strong> {selected.heure}</p>
            <p>
              <strong>Statut :</strong>{' '}
              <span style={{ color: STATUT_COLORS[selected.statut], fontWeight: 'bold' }}>
                {selected.statut}
              </span>
            </p>
            <button onClick={() => setSelected(null)} style={styles.btnClose}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: '0.5rem' },
  legend: { display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#475569' },
  dot: { display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', marginRight: '6px' },
  calendarWrapper: {
    backgroundColor: 'white', padding: '1.5rem',
    borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  popup: {
    backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)', minWidth: '320px',
  },
  popupTitle: { color: '#1a56db', marginBottom: '1rem' },
  btnClose: {
    marginTop: '1rem', padding: '0.6rem 1.5rem',
    backgroundColor: '#1a56db', color: 'white',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontWeight: 'bold',
  },
};

export default CalendarView;