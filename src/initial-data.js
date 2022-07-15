import { loremIpsum } from 'lorem-ipsum';

const length = 1000;
const sentences = [1, 2, 3];
const numberOfColumns = 60;
const columnsId = Array.from({ length: numberOfColumns }).map((_, index) => index);

const tasks = Array.from({ length }, (_, index) => ({
  id: `task-${index}`,
  content: loremIpsum({
    count: sentences[Math.floor(Math.random() * sentences.length)],
    units: 'sentences',
  }),
  columnId: columnsId[Math.floor(Math.random() * columnsId.length)],
}));

const columns = Array.from({ length: numberOfColumns }).map((_, index) => ({
  id: `column-${index}`,
  title: `Danh mục ${index}`,
  taskIds: tasks.filter(({ columnId }) => columnId === index).map(({ id }) => id),
}));

const convertArrayToObject = (array, key, prefix = '') =>
  array.reduce(
    (object, item) => ({
      ...object,
      [`${prefix}${item[key]}`]: item,
    }),
    {}
  );

const initialData = {
  tasks: convertArrayToObject(tasks, 'id'),
  columns: convertArrayToObject(columns, 'id'),
  columnOrder: columns.map(({ id }) => id),
};

export default initialData;
