// Temporary mocked service to support Vuex-first development
const getList = async (payload) => {
    const mockItems = [
        { workoutNumber: 1, workoutName: 'Upper body A', workoutDescription: 'Push focus', days: ['Mon', 'Thu'] },
        { workoutNumber: 2, workoutName: 'Lower body B', workoutDescription: 'Squat focus', days: ['Tue', 'Fri'] }
    ];
    return Promise.resolve({ data: { data: { items: mockItems, count: mockItems.length, nextPageId: null } } });
};

const getById = async () => Promise.resolve({ data: { data: {} } });
const create = async () => Promise.resolve({ data: { data: {} } });
const remove = async () => Promise.resolve({ data: { data: {} } });

export const trainingService = { getList, getById, create, remove };
