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
    res.render('index'); 
  } catch (error) {
    console.error('Error fetching customers:', error);
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

router.post('/customers', async (req, res) => {
  try {
    const { HOTEN, DCHI, SODT, NGSINH, NGDK, DOANHSO, KHU_VUC } = req.body;
    const customerRepository = getRepository(Customer);
    
    const customer = customerRepository.create({
      HOTEN,
      DCHI,
      SODT,
      NGSINH,
      NGDK,
      DOANHSO,
      region: { MA_KV: KHU_VUC } 
    });
    
    await customerRepository.save(customer);

    res.redirect('/customers');
  } catch (error) {
    console.error('Error saving customer:', error);
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
      region: { MA_KV: KHU_VUC } 
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
      region: { MA_KV: KHU_VUC } 
    });

    res.redirect('/employee');
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/employees/delete/:MANV', async (req, res) => {
  const { MANV } = req.params;
  try {
    const employeeRepository = getRepository(Employee);
    await employeeRepository.delete(MANV);
    
    res.redirect('/employee'); 
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/orders', async (req, res) => {
  try {
      const customerRepository = getRepository(Customer);
      const employeeRepository = getRepository(Employee);
      const regionRepository = getRepository(Region);
      const ProductRepository = getRepository(Product);

      const customers = await customerRepository.find();
      const employees = await employeeRepository.find();
      const regions = await regionRepository.find();
      const products  = await ProductRepository.find();

      res.render('orderForm', { customers, employees, regions, products  });
  } catch (error) {
      console.error('Error fetching data for order form:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.post('/orders', async (req, res) => {
  try {
      const { MAKH, MANV, KHU_VUC, MASP, SL } = req.body;

      const productRepository = getRepository(Product);
      const product = await productRepository.findOne({ where: { MASP } });
      
      if (!product) {
          return res.status(404).send('Product not found');
      }

      const TRIGIA = product.GIA * SL; 

      const invoiceRepository = getRepository(Invoice);
      const invoice = invoiceRepository.create({
          NGHD: new Date(),
          customer: { MAKH }, 
          employee: { MANV }, 
          TRIGIA,
          region: { MA_KV: KHU_VUC }, 
      });

      const savedInvoice = await invoiceRepository.save(invoice);

      const invoiceDetailRepository = getRepository(InvoiceDetail);
      const invoiceDetail = invoiceDetailRepository.create({
        SOHD: savedInvoice.SOHD,
        MASP,
        SL
      });

      await invoiceDetailRepository.save(invoiceDetail); 

      res.redirect(`/invoicesDetail/${savedInvoice.SOHD}`); 
  } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/invoicesDetail/:SOHD', async (req, res) => {
  const { SOHD } = req.params;

  try {
      const invoiceRepository = getRepository(Invoice);
      const invoice = await invoiceRepository.findOne({
          where: { SOHD },
          relations: ['customer', 'employee', 'region', 'invoiceDetails'] 
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
