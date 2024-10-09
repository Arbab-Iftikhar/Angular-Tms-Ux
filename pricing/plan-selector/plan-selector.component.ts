import { Component } from '@angular/core';
import { HttpURIService } from '../../app.http.uri.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-plan-selector',
  templateUrl: './plan-selector.component.html',
  styleUrl: './plan-selector.component.scss'
})
export class PlanSelectorComponent {
  activeTab: string = 'home';
  title = 'Load Boards For Shipper​​​';
  plans = [
    {
      title: 'TMS',
      subtitle: 'Plan 1',
      price: 145,
      currency : "$",
      duration: 'month'
    },
    {
      title: 'TMS',
      subtitle: 'Plan 2',
      price: 260,
      currency : "$",
      duration: 'month'
    },
    {
      title: 'TMS',
      subtitle: 'Plan 3',
      price: 395,
      currency : "$",
      duration: 'month'
    }
  ];
  table = [
    {
      feature: 'Unlimited Search & Post',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'Priority Booking',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'TMS Directory',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'Canadian Trucks',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'Multiple Searches and Filtering',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'TMS & FTP Integration',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'TMS CarrierWatch',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'CarrierWatch Insurance Certificates',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'LaneMakers',
      plan1: true,
      plan2: true,
      plan3: false
    },
    {
      feature: 'Preferred & Blocked Companies',
      plan1: false,
      plan2: true,
      plan3: false
    },
    {
      feature: 'Group Postings',
      plan1: false,
      plan2: true,
      plan3: false
    }
  ];
  features =[
    {
      feature: 'Unlimited Search & Post',
      plan1: true,
      plan2: true,
      plan3: true
    },
    {
      feature: 'Priority Booking',
      plan1: true,
      plan2: true,
      plan3: true
    },
    {
      feature: 'TMS Directory',
      plan1: true,
      plan2: true,
      plan3: true
    },
    {
      feature: 'Canadian Trucks',
      plan1: true,
      plan2: true,
      plan3: true
    },
    {
      feature: 'Multiple Searches and Filtering',
      plan1: false,
      plan2: true,
      plan3: true
    },
    {
      feature: 'TMS & FTP Integration',
      plan1: false,
      plan2: true,
      plan3: true
    },
    {
      feature: 'TMS CarrierWatch',
      plan1: false,
      plan2: true,
      plan3: true
    },
    {
      feature: 'CarrierWatch Insurance Certificates',
      plan1: false,
      plan2: false,
      plan3: true
    },
    {
      feature: 'LaneMakers',
      plan1: false,
      plan2: false,
      plan3: true
    },
    {
      feature: 'Preferred & Blocked Companies',
      plan1: false,
      plan2: false,
      plan3: true
    },
    {
      feature: 'Group Postings',
      plan1: false,
      plan2: false,
      plan3: true
    }
  ];
  combo: string[] = [
    '1- One-Stop Transportation Resource',
    '2- On-demand network of 668,000 trucks',
    '3- Find safe, legal, reliable carriers',
    '4- Identify new sources of truckload capacity',
    '5- Vans, reefers, flatbeds, and specialty trailers'
  ];
  selectedPlans = this.plans.filter(plan => plan.price === 145 || plan.price === 260);
constructor(private router: Router, private route: ActivatedRoute){
  
}
  setActiveTab(tab: string) {
    this.activeTab = tab; 
  }
  buyNow(plan: any) {
    this.router.navigate(['auth/signUp'], { relativeTo: this.route.parent })
    .then(success => console.log('Navigation success:', success))
    .catch(err => console.error('Navigation error:', err));
        console.log(`Buying plan: ${plan.title} - ${plan.price}`);
  }
}
