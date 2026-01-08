import { useEffect, useState } from 'react';
import { Button } from 'antd';

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
          <li><a href="#contact">О нас</a></li>
          <li className="media-li"><a href="/">Правила мероприятия</a></li>
          <li><a href="/" className="ticket">Билеты</a></li>
        </ul>
        <a href='https://t.me/Heppyduck2026' target="_blank" className="contact-item"><Button type="primary">Остались вопросы?</Button></a>
      </nav>
    </header>
  )
}

export default Header;