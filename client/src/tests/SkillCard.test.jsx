import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import SkillCard from '../components/SkillCard';

const skill = {
  id: 'skill-1',
  name: 'Test Skill',
  description: 'A skill used for testing purposes.',
  category: 'Engineering',
  tags: ['testing', 'automation'],
  owner: 'QA Team',
  status: 'Published',
};

describe('SkillCard', () => {
  test('renders skill name, description, tags, and status', () => {
    render(
      <MemoryRouter>
        <SkillCard skill={skill} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Skill')).toBeInTheDocument();
    expect(screen.getByText(/A skill used for testing/)).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('automation')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  test('links to the skill detail page', () => {
    render(
      <MemoryRouter>
        <SkillCard skill={skill} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/skills/skill-1');
  });
});
