import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Customer } from '../entities/Customer';
import { Product } from '../entities/Product';
import { Employee } from '../entities/Employee';
import { Region } from '../entities/Region';
import { Invoice } from '../entities/Invoice';
import { InvoiceDetail } from '../entities/InvoiceDetail';

const router = Router();


router.get('/', async (req, res) => {
  try {
    const invoiceDetailRepository = getRepository(InvoiceDetail);
    const customerRepository = getRepository(Customer);

    const totalProductsPurchased = await invoiceDetailRepository
      .createQueryBuilder('cthd')
      .select('SUM(cthd.SL)', 'total')
      .getRawOne();

    const customersWithOrders = await customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.invoices', 'invoice') 
      .select([
        'customer.MAKH',
        'customer.HOTEN',
        'invoice.SOHD',
        'invoice.TRIGIA',
        'invoice.NGHD',
      ])
      .getMany();

    res.render('index', {
      totalProductsPurchased: totalProductsPurchased.total,
      customersWithOrders,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/products', async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const customerRepository = getRepository(Customer);
    const employeeRepository = getRepository(Employee);

    const products = await productRepository.find();
    const customers = await customerRepository.find();
    const employees = await employeeRepository.find();

    res.render('products', { products, customers, employees });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/products/all', async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find({ relations: ['region'] });
    res.render('productionsAll', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/products/add', (req, res) => {
  res.render('productionsAdd');
});

router.post('/products/add', async (req, res) => {
  const { TENSP, DVT, NUOCSX, GIA, KHU_VUC } = req.body;
  try {
    const productRepository = getRepository(Product);
    const regionRepository = getRepository(Region);

    const region = await regionRepository.findOne({ where: { TEN_KV: KHU_VUC } });
    
    if (!region) {
      return res.status(400).send('Region not found');
    }
    
    const newProduct = productRepository.create({
      TENSP,
      DVT,
      NUOCSX,
      GIA,
      region 
    });

    await productRepository.save(newProduct);
    res.redirect('/products/all');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/products/edit/:MASP', async (req, res) => {
  const { MASP } = req.params;
  try {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({ where: { MASP } });
    res.render('productionsEdit', { product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/products/edit/:MASP', async (req, res) => {
  const { MASP } = req.params;
  const { TENSP, DVT, NUOCSX, GIA } = req.body;
  try {
    const productRepository = getRepository(Product);
    await productRepository.update(MASP, {
      TENSP,
      DVT,
      NUOCSX,
      GIA,
    });
    res.redirect('/products/all');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/products/delete/:MASP', async (req, res) => {
  const { MASP } = req.params;
  try {
    const productRepository = getRepository(Product);
    await productRepository.delete(MASP);
    res.redirect('/products/all');
  } catch (error) {
    console.error('Error deleted product:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/order', async (req, res) => {
  try {
    const { MAKH, MANV, products } = req.body;
    
    const invoiceRepository = getRepository(Invoice);
    const newInvoice = invoiceRepository.create({
      NGHD: new Date(),
      customer: { MAKH },
      employee: { MANV },
      KHU_VUC: 'KV01',
      TRIGIA: products.reduce((total, p) => total + p.GIA * p.SL, 0)
    });
    const savedInvoice = await invoiceRepository.save(newInvoice);

    const invoiceDetailRepository = getRepository(InvoiceDetail);
    for (let product of products) {
      const invoiceDetail = invoiceDetailRepository.create({
        SOHD: savedInvoice.SOHD,
        MASP: product.MASP,
        SL: product.SL
      });
      await invoiceDetailRepository.save(invoiceDetail);
    }

    res.redirect(`/invoicesDetail/${savedInvoice.SOHD}`);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/employee', async (req, res) => {
  try {
    const employeeRepository = getRepository(Employee);
    const employees = await employeeRepository.find({ relations: ['region'] });
    res.render('employee', { employees }); 
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/employees/edit/:MANV', async (req, res) => {
  const { MANV } = req.params;
  try {
    const employeeRepository = getRepository(Employee);
    const employee = await employeeRepository.findOne({
      where: { MANV },
      relations: ['region'], 
    });
    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    res.render('editEmployee', { employee }); 
  } catch (error) {
    console.error('Error fetching employee for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/employee', async (req, res) => {
  try {
    const { HOTEN, SODT, KHU_VUC } = req.body;
    const customerRepository = getRepository(Employee);
    
    const customer = customerRepository.create({
      HOTEN,
      SODT,
      NGVL: new Date(),
      region: { MA_KV: 'KV01' } 
    });
    
    await customerRepository.save(customer);

    res.redirect('/employee');
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/employees/edit/:MANV', async (req, res) => {
  const { MANV } = req.params;
  const { HOTEN, SODT, KHU_VUC } = req.body;

  try {
    const employeeRepository = getRepository(Employee);
    await employeeRepository.update(MANV, {
      HOTEN,
      SODT,
      region: { MA_KV: 'KV01' } 
    });

    res.redirect('/employee');
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/customers', async (req, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const customers = await customerRepository.find();
    res.render('customers', { customers }); 
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/customers/add', async (req, res) => {
  const { HOTEN, DCHI, SODT, NGSINH } = req.body; 

  try {
    const customerRepository = getRepository(Customer);
    
    const newCustomer = customerRepository.create({
      HOTEN,
      DCHI,
      SODT,
      NGSINH,
      NGDK: new Date(),
      KHU_VUC: 'KV01',
      DOANHSO: 0
    });

    await customerRepository.save(newCustomer);

    res.redirect('/customers');
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/customers/edit/:MAKH', async (req, res) => {
  const { MAKH } = req.params;
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({ where: { MAKH } });

    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    res.render('editCustomer', { customer });
  } catch (error) {
    console.error('Error fetching customer for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/customers/edit/:MAKH', async (req, res) => {
  const { MAKH } = req.params;
  const { HOTEN, DCHI, SODT, NGSINH, NGDK, DOANHSO } = req.body; 

  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({ where: { MAKH } });

    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    customer.HOTEN = HOTEN;
    customer.DCHI = DCHI;
    customer.SODT = SODT;
    customer.NGSINH = new Date(NGSINH);
    customer.NGDK = new Date(NGDK);
    customer.DOANHSO = DOANHSO;

    await customerRepository.save(customer);
    res.redirect('/customers');
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/customers/delete/:MAKH', async (req, res) => {
  const { MAKH } = req.params;
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne(MAKH);

    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    await customerRepository.remove(customer);
    res.redirect('/customers');
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/invoicesDetail/:SOHD', async (req, res) => {
  const { SOHD } = req.params;

  try {
    const invoiceRepository = getRepository(Invoice);
    const invoice = await invoiceRepository.findOne({
      where: { SOHD },
      relations: ['customer', 'employee', 'region', 'invoiceDetails', 'invoiceDetails.product']
    });

    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    res.render('invoiceDetail', { invoice });
  } catch (error) {
    console.error('Error fetching invoice detail:', error);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
