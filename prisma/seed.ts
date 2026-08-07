import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const subjects = [
    { name: 'Matemática', slug: 'matematica' },
    { name: 'Linguagens', slug: 'linguagens' },
    { name: 'Ciências Humanas', slug: 'ciencias-humanas' },
    { name: 'Ciências da Natureza', slug: 'ciencias-natureza' },
  ];

  for (const subjectData of subjects) {
    await prisma.subject.upsert({
      where: { slug: subjectData.slug },
      update: { name: subjectData.name },
      create: {
        ...subjectData,
        description: `Conteúdos de ${subjectData.name} para estudo e preparação para provas.`,
      },
    });
  }

  const matematica = await prisma.subject.findUniqueOrThrow({ where: { slug: 'matematica' } });
  const topic = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: matematica.id, slug: 'funcoes' } },
    update: {},
    create: { subjectId: matematica.id, name: 'Funções', slug: 'funcoes', description: 'Conceitos básicos de funções.' },
  });

  const existing = await prisma.question.count({ where: { topicId: topic.id } });
  if (existing === 0) {
    await prisma.question.create({
      data: {
        topicId: topic.id,
        enunciation: 'Se f(x) = 2x + 3, qual é o valor de f(4)?',
        difficulty: 'easy',
        source: 'StudyFlow AI Demo',
        explanation: 'Substitua x por 4: f(4) = 2 × 4 + 3 = 11.',
        alternatives: {
          create: [
            { letter: 'A', text: '7', isCorrect: false },
            { letter: 'B', text: '9', isCorrect: false },
            { letter: 'C', text: '11', isCorrect: true },
            { letter: 'D', text: '12', isCorrect: false },
            { letter: 'E', text: '14', isCorrect: false },
          ],
        },
      },
    });
  }

  console.log('StudyFlow AI seed concluído.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
