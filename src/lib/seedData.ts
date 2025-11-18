import { supabase } from 'lib/supabase/client';

export async function seedUserData(userId: string) {
  try {
    // Check if user already has data
    const { data: existingAffirmations } = await supabase
      .from('affirmations')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (existingAffirmations && existingAffirmations.length > 0) {
      console.log('User already has seed data');
      return;
    }

    // Seed Affirmations
    const affirmations = [
      { text: 'I am focused and disciplined', category: 'discipline', order_index: 1 },
      { text: 'I am a master of my finances', category: 'finance', order_index: 2 },
      { text: 'I execute flawlessly', category: 'discipline', order_index: 3 },
      { text: 'I am confident in my abilities', category: 'confidence', order_index: 4 },
      { text: 'I close deals with ease', category: 'sales', order_index: 5 },
    ];

    const { error: affirmationsError } = await supabase
      .from('affirmations')
      .insert(
        affirmations.map(a => ({
          user_id: userId,
          ...a,
        }))
      );

    if (affirmationsError) throw affirmationsError;

    // Seed Motivations
    const motivations = [
      {
        quote: 'Discipline is the bridge between goals and accomplishment.',
        author: 'Jim Rohn',
        category: 'discipline',
      },
      {
        quote: 'The best time to plant a tree was 20 years ago. The second best time is now.',
        author: 'Chinese Proverb',
        category: 'finance',
      },
      {
        quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill',
        category: 'confidence',
      },
      {
        quote: 'Your income is directly related to your philosophy, not the economy.',
        author: 'Jim Rohn',
        category: 'finance',
      },
      {
        quote: 'Don\'t watch the clock; do what it does. Keep going.',
        author: 'Sam Levenson',
        category: 'discipline',
      },
    ];

    const { error: motivationsError } = await supabase
      .from('motivations')
      .insert(
        motivations.map(m => ({
          user_id: userId,
          ...m,
        }))
      );

    if (motivationsError) throw motivationsError;

    // Seed Sample Project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          name: 'Personal Goals',
          color: '#6366f1',
          description: 'My personal development goals',
        },
      ])
      .select()
      .single();

    if (projectError) throw projectError;

    // Seed Sample Tasks
    const tasks = [
      {
        title: 'Review financial goals',
        description: 'Review and update Q4 financial projections',
        priority: 'high',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        project_id: project.id,
      },
      {
        title: 'Complete monthly budget',
        description: 'Finalize budget for next month',
        priority: 'urgent',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        project_id: project.id,
      },
      {
        title: 'Update CRM contacts',
        description: 'Add new leads from networking event',
        priority: 'medium',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
        project_id: project.id,
      },
    ];

    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(
        tasks.map(t => ({
          user_id: userId,
          ...t,
        }))
      );

    if (tasksError) throw tasksError;

    console.log('✅ Seed data created successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}
