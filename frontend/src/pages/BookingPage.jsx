import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { headerUrl } from '@features/hotel/adapters';
import { usePages } from '@lib/queries/usePages';
import { asPlain } from '@lib/richText';
import PageHero from '@components/ui/PageHero';
import { BookingProvider, useBooking } from '@lib/booking/BookingContext';
import { useCart } from '@lib/cart/CartContext';
import { useAvailability } from '@lib/queries/useAvailability';
import { findBlockingClosure } from '@features/hotel/availability';
import BookingStepper from '@sections/booking/BookingStepper';
import Step1Stay from '@sections/booking/Step1Stay';
import Step2Guest from '@sections/booking/Step2Guest';
import Step3Confirm from '@sections/booking/Step3Confirm';
import StaySummaryCard from '@sections/booking/StaySummaryCard';
import BookingFooterBar from '@sections/booking/BookingFooterBar';
import Reveal from '@components/ui/Reveal';
import styles from './BookingPage.module.css';


function BookingFlow() {
  const { step, stay, nights, guest, nextStep, prevStep } = useBooking();
  const { rooms, roomCount } = useCart();
  const { data: closures = [] } = useAvailability();
  const datesClosed = Boolean(
    findBlockingClosure(closures, {
      checkIn: stay.checkIn,
      checkOut: stay.checkOut,
      roomSlugs: rooms.map((room) => room.roomId),
    }),
  );

  const step1Valid = Boolean(stay.checkIn && stay.checkOut && nights > 0 && roomCount > 0 && !datesClosed);
  const step2Valid = Boolean(guest.firstName && guest.lastName && guest.mobile);

  return (
    <>
      <Link to="/" className={styles.backHome}>
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <Reveal>
        <BookingStepper currentStep={step} />
      </Reveal>

      <div className={styles.layout}>
        <Reveal className={styles.main}>
          {step === 1 && <Step1Stay />}
          {step === 2 && <Step2Guest />}
          {step === 3 && <Step3Confirm />}
        </Reveal>

        <Reveal delay={100}>
          <StaySummaryCard />
        </Reveal>
      </div>

      <BookingFooterBar
        onBack={prevStep}
        onContinue={nextStep}
        continueLabel="Continue"
        continueDisabled={step === 1 ? !step1Valid : step === 2 ? !step2Valid : false}
        showContinue={step !== 3}
      />
    </>
  );
}

export default function BookingPage() {
  const { data } = usePages();
  const hero = data?.booking?.hero || {};
  const intro = asPlain(hero.intro);
  const hasHero = Boolean(hero.eyebrow || hero.headline || intro || hero.backgroundImage || hero.cta?.label);

  return (
    <>
      {hasHero && (
        <PageHero
          image={headerUrl(hero.backgroundImage, data?.defaultHeaderImage)}
          eyebrow={hero.eyebrow}
          title={hero.headline}
          text={intro}
          primaryTo={hero.cta?.path}
          primaryLabel={hero.cta?.label}
          secondaryTo={hero.secondaryCta?.path}
          secondaryLabel={hero.secondaryCta?.label}
        />
      )}
      <section className={styles.section}>
        <div className="container">
          <BookingProvider>
            <BookingFlow />
          </BookingProvider>
        </div>
      </section>
    </>
  );
}