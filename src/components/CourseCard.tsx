import type { CourseCardProps } from '@/types/courses';
import React from 'react';



const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const formatNum = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);

  return (
    <div
      onClick={() => onClick?.(course)}
      className="bg-[#181828] border border-white/[0.08] rounded-[20px] overflow-hidden cursor-pointer
        transition-all duration-300 hover:border-white/15 hover:-translate-y-[6px]
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group"
    >
      {/* Image */}
      <div className="h-[180px] relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border
          ${course.featured
            ? 'bg-[rgba(108,99,255,0.85)] border-[#6C63FF] text-white'
            : 'bg-[rgba(10,10,20,0.8)] border-white/[0.08] text-[#B8B8D0]'
          }`}>
          {course.featured ? '⭐ Featured' : course.level}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-xs text-[#8B85FF] font-semibold uppercase tracking-wide mb-2">{course.category}</div>
        <h3 className="text-[17px] font-bold leading-snug tracking-tight text-white mb-2 line-clamp-2">{course.title}</h3>
        <div className="flex items-center gap-4 text-sm text-[#7878A0] mb-3">
          <span className="text-[#FFD93D] font-semibold">★ {course.rating}</span>
          <span>({formatNum(course.reviewCount)})</span>
          <span>⏱ {course.duration}</span>
          <span>👥 {formatNum(course.studentsEnrolled)}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-sm text-[#B8B8D0]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6B6B] flex items-center justify-center text-xs font-bold text-white">
              {getInitials(course.instructor)}
            </div>
            <span className="truncate max-w-[120px]">{course.instructor}</span>
          </div>
          <div className="text-xl font-extrabold text-white font-['Sora']">
            <sup className="text-sm vertical-top mt-1">₹</sup>{course.price.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;