import { MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Role IDs from the roles table
const ROLE_IDS = {
  BASIC: 1,
  DEVOTEE: 2,
  ADMIN: 3,
} as const;

interface SocialLinks {
  website?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

interface MemberCardProps {
  name: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
  socialLinks?: SocialLinks;
  missionDescription?: string;
  roleId?: number;
  avatarUrl?: string;
}

export const MemberCard = ({
  name,
  city,
  country,
  email,
  phone,
  socialLinks,
  missionDescription,
  roleId = ROLE_IDS.DEVOTEE,
  avatarUrl,
}: MemberCardProps) => {
  const hasSocialLinks = socialLinks && Object.values(socialLinks).some(Boolean);

  const getRoleBadge = () => {
    switch (roleId) {
      case ROLE_IDS.ADMIN:
        return <Badge variant="default" className="bg-primary text-primary-foreground">Admin</Badge>;
      case ROLE_IDS.BASIC:
        return <Badge variant="outline" className="text-muted-foreground">Basic</Badge>;
      default:
        return <Badge variant="secondary" className="bg-saffron-light text-saffron-dark">Devotee</Badge>;
    }
  };

  return (
    <Card className="elevated-card group hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-sm font-medium">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {name}
              </h3>
              {getRoleBadge()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
              <span className="text-sm truncate">
                {city}, {country}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {missionDescription && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {missionDescription}
          </p>
        )}

        <div className="space-y-2">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
          )}
        </div>

        {hasSocialLinks && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2 py-1 rounded-md"
              >
                <Globe className="h-3 w-3" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2 py-1 rounded-md"
              >
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2 py-1 rounded-md"
              >
                Facebook
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-2 py-1 rounded-md"
              >
                Instagram
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
