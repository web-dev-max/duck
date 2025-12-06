import { useEffect, useState } from 'react';

import './header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const observerScroll = () => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }

  useEffect(() => {
    observerScroll();
  }, []);
  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <nav>
        <img src="/images/duck.png" />
        <ul>
          <li><a href="#">О нас</a></li>
          <li><a href="#">Мероприятие</a></li>
          <li><a href="#" className="ticket">Билеты</a></li>
        </ul>
        <button>Остались вопросы?</button>
      </nav>
    </header>
  )
}

export default Header;