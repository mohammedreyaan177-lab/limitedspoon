import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'outlineLight' | 'leaf';

const VARIANT_CLASS: Record<ButtonVariant, string | undefined> = {
  solid: undefined,
  soft: styles.btnSoft,
  outline: styles.btnOutline,
  outlineLight: styles.btnOutlineLight,
  leaf: styles.btnLeaf,
};

function classes(variant: ButtonVariant, size: 'md' | 'lg', fullWidth: boolean, extra?: string) {
  return [
    styles.btn,
    VARIANT_CLASS[variant],
    size === 'lg' ? styles.btnLg : '',
    fullWidth ? styles.btnBlock : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * No trailing arrow glyph.
 *
 * An arrow icon appended to every label is template chrome: it stops carrying
 * meaning once four different links all wear one. Hover motion here comes from
 * the surface and border instead, so the label stays a plain verb phrase.
 */
type ButtonProps = {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, fullWidth, className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'>;

export function ButtonLink({
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, fullWidth, className)} {...rest}>
      {children}
    </Link>
  );
}

interface AnchorButtonProps {
  href: string;
  external?: boolean;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Outbound link. Leaving the site without `noopener` is a real (if small)
 * tabnabbing risk, so it is the default rather than something callers must
 * remember.
 */
export function AnchorButton({
  href,
  external = false,
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}: AnchorButtonProps) {
  const isExternal = external || /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={classes(variant, size, fullWidth, className)}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}