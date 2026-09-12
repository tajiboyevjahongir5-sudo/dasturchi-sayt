import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Heart, GitBranch, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-12 text-sm text-muted-foreground">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <Logo showTagline={true} />
          <p className="max-w-sm text-xs leading-relaxed">
            Dasturlashni 0 dan professional darajagacha o‘zbek tilida o‘rgatuvchi zamonaviy interaktiv ta’lim platformasi. Nazariya, amaliyot va real loyihalar bir joyda.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span>O‘zbekistonda</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>bilan yaratildi</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Yo‘nalishlar</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses" className="hover:text-primary transition-colors">
                Dasturlashga kirish
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-primary transition-colors">
                HTML Asoslari
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-primary transition-colors">
                CSS Asoslari
              </Link>
            </li>
            <li>
              <Link href="/courses" className="hover:text-primary transition-colors">
                JavaScript Asoslari
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Platforma</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/learning-path" className="hover:text-primary transition-colors">
                O‘quv xaritasi
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Shaxsiy kabinet
              </Link>
            </li>
            <li>
              <a
                href="https://t.me/codequest_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-blue-400" />
                Telegram hamjamiyat
              </a>
            </li>
            <li>
              <a
                href="https://github.com/codequest-uz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-foreground" />
                Ochiq kodli loyiha
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
        <p>© 2026 CodeQuest. Barcha huquqlar himoyalangan.</p>
        <p className="text-muted-foreground">“Dasturlashni yodlamang — tushuning, yozing va yarating.”</p>
      </div>
    </footer>
  );
}
