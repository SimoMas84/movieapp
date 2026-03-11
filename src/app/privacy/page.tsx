/* =============================================
   PRIVACY POLICY PAGE
   GDPR-compliant privacy policy for MovieApp.
   Covers: authentication, favorites, watchlist,
   Supabase, Vercel Analytics, TMDB.
   Last updated: March 2026
   ============================================= */

export const metadata = {
  title: "Privacy Policy | MovieApp",
  description:
    "Informativa sulla privacy di MovieApp — come raccogliamo e utilizziamo i tuoi dati.",
};

const LAST_UPDATED = "11 marzo 2026";
const OWNER_NAME = "Simone Massaccesi";
const OWNER_EMAIL = "info@movieapp.it";
const APP_URL = "https://movieapp.it";

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-12">
        <span className="text-xs px-2 py-1 rounded-sm border border-accent/30 text-accent bg-accent/10 mb-4 inline-block">
          Documento legale
        </span>
        <h1 className="text-3xl md:text-5xl font-light text-text-primary mt-4 mb-3 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-text-secondary text-sm">
          Ultimo aggiornamento:{" "}
          <span className="text-text-primary">{LAST_UPDATED}</span>
        </p>
      </div>

      {/* ── Content ── */}
      <div className="space-y-10 text-text-secondary text-sm md:text-base leading-relaxed">
        {/* 1 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            1. Titolare del trattamento
          </h2>
          <p>
            Il titolare del trattamento dei dati personali è{" "}
            <span className="text-text-primary font-medium">{OWNER_NAME}</span>,
            raggiungibile all'indirizzo email{" "}
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="text-accent hover:underline"
            >
              {OWNER_EMAIL}
            </a>
            .
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            2. Dati raccolti e finalità
          </h2>
          <p className="mb-4">
            MovieApp raccoglie i seguenti dati personali esclusivamente per le
            finalità indicate:
          </p>
          <div className="space-y-4">
            <div className="bg-surface-1 border border-border-subtle rounded-xl p-4">
              <h3 className="text-text-primary font-medium mb-1">
                Registrazione e autenticazione
              </h3>
              <p>
                Al momento della registrazione raccogliamo il tuo{" "}
                <strong className="text-text-primary">indirizzo email</strong> e
                una <strong className="text-text-primary">password</strong>{" "}
                (conservata in forma cifrata). Questi dati sono necessari per
                creare e gestire il tuo account. La base giuridica è
                l'esecuzione del contratto (art. 6, par. 1, lett. b GDPR).
              </p>
            </div>
            <div className="bg-surface-1 border border-border-subtle rounded-xl p-4">
              <h3 className="text-text-primary font-medium mb-1">
                Preferiti e Watchlist
              </h3>
              <p>
                Salviamo i film e le serie TV che aggiungi ai{" "}
                <strong className="text-text-primary">Preferiti</strong> o alla{" "}
                <strong className="text-text-primary">Watchlist</strong>. Questi
                dati sono associati al tuo account e conservati nel nostro
                database. La base giuridica è l'esecuzione del contratto e il
                tuo consenso esplicito.
              </p>
            </div>
            <div className="bg-surface-1 border border-border-subtle rounded-xl p-4">
              <h3 className="text-text-primary font-medium mb-1">
                Dati di navigazione e analytics
              </h3>
              <p>
                Con il tuo consenso, utilizziamo{" "}
                <strong className="text-text-primary">Vercel Analytics</strong>{" "}
                per raccogliere dati aggregati e anonimi sull'utilizzo del sito
                (pagine visitate, durata della sessione, paese di provenienza).
                Non vengono raccolte informazioni personali identificabili
                tramite analytics.
              </p>
            </div>
          </div>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            3. Responsabili del trattamento (Sub-processor)
          </h2>
          <p className="mb-4">
            Per fornire i propri servizi, MovieApp si avvale dei seguenti
            fornitori terzi che trattano dati per nostro conto:
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent mt-1">→</span>
              <div>
                <strong className="text-text-primary">Supabase Inc.</strong> —
                fornitore di database e autenticazione. I dati sono conservati
                su server in area UE. Privacy Policy:{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  supabase.com/privacy
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent mt-1">→</span>
              <div>
                <strong className="text-text-primary">Vercel Inc.</strong> —
                hosting e analytics. Privacy Policy:{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  vercel.com/legal/privacy-policy
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent mt-1">→</span>
              <div>
                <strong className="text-text-primary">
                  The Movie Database (TMDB)
                </strong>{" "}
                — fonte dei dati su film, serie e persone. MovieApp utilizza la
                loro API pubblica. I dati TMDB non contengono informazioni
                personali degli utenti. Privacy Policy:{" "}
                <a
                  href="https://www.themoviedb.org/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  themoviedb.org/privacy-policy
                </a>
              </div>
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            4. Cookie e tecnologie di tracciamento
          </h2>
          <p className="mb-4">MovieApp utilizza i seguenti tipi di cookie:</p>
          <div className="space-y-3">
            <div className="bg-surface-1 border border-border-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-sm bg-accent/10 text-accent border border-accent/20">
                  Necessari
                </span>
                <h3 className="text-text-primary font-medium">
                  Cookie di sessione (Supabase Auth)
                </h3>
              </div>
              <p>
                Utilizzati per mantenere attiva la sessione di autenticazione
                dell'utente. Sono cookie tecnici strettamente necessari al
                funzionamento del servizio e non richiedono consenso ai sensi
                dell'art. 82 del Codice Privacy.
              </p>
            </div>
            <div className="bg-surface-1 border border-border-subtle rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-sm bg-blue-400/10 text-blue-400 border border-blue-400/20">
                  Analitici
                </span>
                <h3 className="text-text-primary font-medium">
                  Vercel Analytics
                </h3>
              </div>
              <p>
                Raccoglie dati anonimi e aggregati sull'utilizzo del sito.
                Attivati solo con il tuo consenso esplicito. Puoi revocare il
                consenso in qualsiasi momento tramite il banner cookie presente
                sul sito.
              </p>
            </div>
          </div>
          <p className="mt-4">
            MovieApp <strong className="text-text-primary">non utilizza</strong>{" "}
            cookie di profilazione, cookie pubblicitari o cookie di terze parti
            a scopo commerciale.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            5. Conservazione dei dati
          </h2>
          <p>
            I dati del tuo account (email, preferiti, watchlist) sono conservati
            fino alla cancellazione del tuo account. I dati analytics sono
            conservati in forma anonima e aggregata per un massimo di 12 mesi.
            Puoi richiedere la cancellazione del tuo account e di tutti i dati
            associati in qualsiasi momento scrivendo a{" "}
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="text-accent hover:underline"
            >
              {OWNER_EMAIL}
            </a>
            .
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            6. I tuoi diritti (GDPR)
          </h2>
          <p className="mb-4">
            In qualità di interessato, hai i seguenti diritti ai sensi del
            Regolamento UE 2016/679:
          </p>
          <ul className="space-y-2">
            {[
              ["Accesso", "richiedere una copia dei tuoi dati personali"],
              ["Rettifica", "correggere dati inesatti o incompleti"],
              [
                "Cancellazione",
                "richiedere la cancellazione dei tuoi dati («diritto all'oblio»)",
              ],
              [
                "Portabilità",
                "ricevere i tuoi dati in formato strutturato e leggibile",
              ],
              [
                "Opposizione",
                "opporti al trattamento per finalità di marketing o analytics",
              ],
              [
                "Revoca del consenso",
                "revocare il consenso in qualsiasi momento senza pregiudicare la liceità del trattamento precedente",
              ],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>
                  <strong className="text-text-primary">{title}:</strong> {desc}
                  .
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Per esercitare i tuoi diritti scrivi a{" "}
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="text-accent hover:underline"
            >
              {OWNER_EMAIL}
            </a>
            . Hai inoltre il diritto di proporre reclamo al{" "}
            <a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Garante per la Protezione dei Dati Personali
            </a>
            .
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            7. Sicurezza
          </h2>
          <p>
            Adottiamo misure tecniche e organizzative adeguate per proteggere i
            tuoi dati personali da accesso non autorizzato, perdita o
            divulgazione. Le password sono conservate in forma cifrata tramite
            bcrypt. Le comunicazioni tra il browser e i server avvengono tramite
            protocollo HTTPS con certificato TLS.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            8. Modifiche alla Privacy Policy
          </h2>
          <p>
            Questa Privacy Policy potrebbe essere aggiornata periodicamente. In
            caso di modifiche sostanziali, gli utenti registrati saranno
            informati via email. La data di ultimo aggiornamento è sempre
            indicata in cima al documento. L'utilizzo continuato del servizio
            dopo le modifiche costituisce accettazione della nuova versione.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-lg md:text-xl font-light text-text-primary mb-3 border-b border-border-subtle pb-2">
            9. Contatti
          </h2>
          <p>
            Per qualsiasi domanda relativa a questa Privacy Policy o al
            trattamento dei tuoi dati personali, scrivi a{" "}
            <a
              href={`mailto:${OWNER_EMAIL}`}
              className="text-accent hover:underline"
            >
              {OWNER_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>

      {/* ── Footer note ── */}
      <div className="mt-16 pt-8 border-t border-border-subtle text-center">
        <p className="text-text-muted text-xs">
          © {new Date().getFullYear()} MovieApp ·{" "}
          <a
            href={APP_URL}
            className="hover:text-text-secondary transition-colors"
          >
            movieapp.it
          </a>
        </p>
      </div>
    </div>
  );
}
