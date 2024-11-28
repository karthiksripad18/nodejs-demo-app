import prisma from "../db";

export const getOneUpdate = async (req, res) => {
  const update = prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: update });
};
export const getUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  /**
   * This is a lot of load on the server (Ex: If there are like 10,000 products)
   * We need to setup our schema better instead of this
   */
  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.json({ data: updates });
};
export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    res.json({ message: "No products exist" });
    return;
  }

  const update = await prisma.update.create({
    data: req.body,
  });

  res.json({ data: update });
};

/***
 * The below code is not the optimal solution
 * There's way to do everything below in one prisma query (or DB query) instead of doing it in Javascript
 *
 * What is the problem here?
 * The below solution will use a lot of memory in the server if `updates` is 10,000 or more rows long.
 * If the Query is optimal, then everything happens on the DB Server and we just get the result
 */
export const updateUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "No update exist for this id" });
    return;
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};
export const deleteUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "No update exist for this id" });
    return;
  }

  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ deleted });
};
