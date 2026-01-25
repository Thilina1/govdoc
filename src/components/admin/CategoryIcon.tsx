'use client';

import {
    Folder, FolderOpen, FolderArchive, FolderCheck,
    FolderClock, FolderHeart, FolderKey, FolderLock,
    FolderSearch, FolderCog,
    FileText, Files, ClipboardList, Building2, Landmark,
    Users, UserCheck, CreditCard, Wallet, Car, Bus,
    GraduationCap, Stethoscope, Briefcase, Globe,
    Shield, ShieldCheck, Plane, Scale, Gavel,
    Leaf, TreePine, Sprout, CloudRain, Sun, Zap, Trash2, Recycle,
    Home, Tent, Hotel, Key, MapPin, Navigation,
    Wifi, Laptop, Smartphone, Server, Cpu,
    BookOpen, Library, Award,
    HeartPulse, Pill, Activity, Syringe, Ambulance,
    Siren, Flame, Construction, HardHat, Hammer,
    Baby, Accessibility, HandHelping, Utensils
} from 'lucide-react';

export const iconMap: Record<string, any> = {
    Folder, FolderOpen, FolderArchive, FolderCheck,
    FolderClock, FolderHeart, FolderKey, FolderLock,
    FolderSearch, FolderCog,
    FileText, Files, ClipboardList, Building2, Landmark,
    Users, UserCheck, CreditCard, Wallet, Car, Bus,
    GraduationCap, Stethoscope, Briefcase, Globe,
    Shield, ShieldCheck, Plane, Scale, Gavel,
    Leaf, TreePine, Sprout, CloudRain, Sun, Zap, Trash2, Recycle,
    Home, Tent, Hotel, Key, MapPin, Navigation,
    Wifi, Laptop, Smartphone, Server, Cpu,
    BookOpen, Library, Award,
    HeartPulse, Pill, Activity, Syringe, Ambulance,
    Siren, Flame, Construction, HardHat, Hammer,
    Baby, Accessibility, HandHelping, Utensils
};

export default function CategoryIcon({ iconName, className }: { iconName?: string | null, className?: string }) {
    const IconComponent = (iconName && iconMap[iconName]) ? iconMap[iconName] : Folder;
    return <IconComponent className={className} />;
}
