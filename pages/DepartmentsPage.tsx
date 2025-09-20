import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departments } from '../services/mockData';
import type { Department } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

const DepartmentCardShimmer: React.FC = () => (
  <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl h-full">
    <div className="h-8 w-1/2 rounded-md shimmer-placeholder mb-4" />
    <div className="space-y-2">
      <div className="h-4 w-full rounded shimmer-placeholder" />
      <div className="h-4 w-5/6 rounded shimmer-placeholder" />
    </div>
    <div className="h-6 w-1/3 rounded-md shimmer-placeholder mt-6" />
  </div>
);

interface DepartmentCardProps {
  department: Department;
  delay: number;
  animationType: 'slide-left' | 'slide-right';
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, delay, animationType }) => {
  const { ref } = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`group scroll-animate ${animationType} perspective-1000`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link
        to={`/departments/${department.id}`}
        className="relative block p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden active:scale-95 transition-all duration-300 ease-in-out h-full border-2 border-transparent group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-2xl group-hover:shadow-cyan-500/30"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-cyan-500/20 dark:bg-cyan-400/10 transition-transform duration-500 group-hover:scale-[10]"></div>
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-white transition-colors duration-300">{department.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-100 transition-colors duration-300">{department.description}</p>
          <span className="mt-6 inline-block font-semibold text-cyan-400 group-hover:text-white transition-colors duration-300">
            Learn More &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
};

const DepartmentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { ref: titleRef } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <DepartmentCardShimmer key={index} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {departments.map((dept, index) => {
          const animationType = index % 2 === 0 ? 'slide-right' : 'slide-left';
          return (
            <DepartmentCard 
              key={dept.id} 
              department={dept} 
              delay={index * 150} 
              animationType={animationType} 
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 md:pb-20 bg-gray-100 dark:bg-transparent min-h-screen">
      <div className="container mx-auto px-6">
        <div ref={titleRef} className="scroll-animate zoom-in text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold font-orbitron text-gray-900 dark:text-white">Our Departments</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">The creative pillars of our club.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DepartmentsPage;