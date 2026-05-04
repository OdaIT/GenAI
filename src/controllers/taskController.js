// API Routes

// POST /api/tasks/create
app.post('/api/tasks/create', async (req, res) => {
    try {
        const { text } = req.body;

        // Input validation
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const task = await createTaskFromText(text.trim());

        res.status(201).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error('Error in /api/tasks/create:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/refine', async (req, res) => {
    try {
        const { taskId, text } = req.body;

        if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'taskId is required and must be a non-empty string'
            });
        }
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const task = await refineTask(taskId.trim(), text.trim());
        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error in /api/tasks/refine:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/suggesttags', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Task is required and must be a non-empty string'
            });
        }

        const tags = await suggestTags(text.trim());
        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error in /api/tasks/suggesttags:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/summarize', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const summary = await summarizeTask(text.trim());
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error in /api/tasks/summarize:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/classifypriority', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const summary = await classifyPriority(text.trim());
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error in /api/tasks/classifypriority:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/classifypriority', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const summary = await classifyPriority(text.trim());
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error in /api/tasks/summarize:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/generatenames', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const summary = await generateNames(text.trim());
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error in /api/tasks/generatenames:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});