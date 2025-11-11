import React from 'react';

interface Skill {
  name: string;
  proficiency: 0 | 1 | 2; // 0 = none, 1 = trained, 2 = expert
}

interface AttributeBlockProps {
  name: string;
  abbreviation: string;
  value: number;
  save?: number; // Optional because Prime doesn't have a save
  skills: Skill[];
  isPrime?: boolean;
}

/**
 * AttributeBlock - Displays an attribute with gold frame on left and skills on right
 * Matches the DC20 character sheet left sidebar layout
 */
function AttributeBlock({ name, abbreviation, value, save, skills, isPrime = false }: AttributeBlockProps) {
  // Calculate skill modifier: attribute value + (proficiency * 2)
  const getSkillModifier = (proficiency: number) => {
    return value + (proficiency * 2);
  };

  // Select different gold frame for each attribute
  const getFramePath = () => {
    if (isPrime) return '/frame/frame-circle-gold-single-with-flourishes.png';

    switch (abbreviation) {
      case 'MIG': return '/frame/frame-square-gold-1.png';
      case 'AGI': return '/frame/frame-square-gold-2.png';
      case 'CHA': return '/frame/frame-square-gold-3.png';
      case 'INT': return '/frame/frame-square-gold-4.png';
      default: return '/frame/frame-square-gold-1.png';
    }
  };

  return (
    <div className="relative bg-parchment border-2 border-brown-accent rounded-lg p-4 mb-3 shadow-parchment">
      <div className="flex gap-4 items-stretch">
        {/* Left: Gold Frame with Attribute */}
        <div className="flex items-center justify-center relative shrink-0 w-24 min-h-[80px]">
          {/* Gold frame overlay */}
          <img
            src={getFramePath()}
            alt=""
            className="absolute inset-0 w-24 h-full object-contain pointer-events-none z-10"
          />

          {/* Attribute content */}
          <div className="relative z-20 w-24 flex flex-col items-center justify-center py-2">
            <div className="font-title text-xs uppercase tracking-wide text-brown-text mb-1">
              {abbreviation}
            </div>
            <div className={`font-title text-2xl font-bold ${value >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {value >= 0 ? '+' : ''}{value}
            </div>
          </div>
        </div>

        {/* Right: Save and Skills */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Attribute Name */}
          <div className="font-title text-lg font-semibold text-brown-text mb-2 px-1">
            {name}
          </div>

          {/* Save (not shown for Prime) */}
          {!isPrime && save !== undefined && (
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-brown-medium/30 px-1">
              <div className="font-sans text-sm uppercase tracking-wide text-brown-medium">
                Save
              </div>
              <div className="font-title text-lg font-semibold text-brown-text">
                {save >= 0 ? '+' : ''}{save}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3 px-1 py-1">
                  {/* Proficiency Circles */}
                  <div className="flex gap-0.5 shrink-0">
                    <div className={`w-3 h-3 rounded-full border-2 ${skill.proficiency >= 1 ? 'bg-brown-accent border-brown-accent' : 'bg-transparent border-brown-medium'}`}></div>
                    <div className={`w-3 h-3 rounded-full border-2 ${skill.proficiency >= 2 ? 'bg-brown-accent border-brown-accent' : 'bg-transparent border-brown-medium'}`}></div>
                  </div>

                  {/* Skill Name */}
                  <div className="font-sans text-sm text-brown-text flex-1">
                    {skill.name}
                  </div>

                  {/* Skill Modifier */}
                  <div className="font-title text-sm font-semibold text-brown-text shrink-0 min-w-[2rem] text-right">
                    {getSkillModifier(skill.proficiency) >= 0 ? '+' : ''}{getSkillModifier(skill.proficiency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttributeBlock;
